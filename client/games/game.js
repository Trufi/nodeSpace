import _ from 'lodash';
import p2 from 'p2';

import * as background from '../modules/background';
import request from '../modules/request';
import camera from '../modules/camera';
import player from '../modules/player';
import render from '../modules/render';
import assets from '../modules/assets';
import User from '../modules/user';
import ping from '../modules/ping';
import step from '../modules/step';
import key from '../modules/key';
import time from '../modules/time';
import * as body from '../body/index';

class Game {
    constructor() {
        // p2.js world
        this.world = null;
        // все тела p2.js
        this.bodies = {};
        // все подключенные юзеры
        this.users = {};

        this.camera = null;

        // фон игры
        this.background = null;

        this.lastGameStepTime = null;

        this.dataFromServer = [];
        this.updateData = [];
        this.ping = ping.get();

        // минимальный интервал через который сервер посылает данные
        this.serverSendStateInterval = 0;

        // игровое состояние
        this.state = null;

        this.isEnable = true;

        this.loop = this.loop.bind(this);
    }

    loop() {
        requestAnimationFrame(this.loop);

        const now = time();

        // шаг мира p2.js
        this.worldStep(now);

        // производим различные действия для нового шага
        this.update(now);

        // отрисовываем сцену
        render.draw();

        this.lastGameStepTime = now;

        this.render();
    }

    addUser(user) {
        this.users[user.id] = user;
    }

    removeUser(user) {
        if (this.users[user.id] !== undefined) {
            delete this.users[user.id];
        }
    }

    addBody(body) {
        this.bodies[body.id] = body;
        body.addToGame(this);
    }

    removeBody(body) {
        delete this.bodies[body.id];
        body.removeFromGame();
    }

    load(options, callback) {
        this.lastGameStepTime = time();

        assets.load(options.game.assets, callback);
    }

    updateFromServerEnable() {
        request.onUpdateGameState(data => {
            // Время сервера отличается от времени клиента
            // Подправляем
            data[0] += ping.dt();

            this.dataFromServer.push(data);
        });
    }

    // обновить только важную информацию об игре (вход, выход игроков и пр.) их данных с сервера
    updateImportant(data) {
        const now = data[0] + this.ping;

        // actions data
        _.forEach(data[1][0], el => {
            if (this.bodies[el[0]] !== undefined) {
                this.bodies[el[0]].updateActions(now, el);
            }
        });

        // new data
        if (data[2]) {
            if (data[2][0] !== 0) {
                _.forEach(data[2][0], el => {
                    if (this.bodies[el[0]] === undefined) {
                        this.addBody(body.create(el));
                    }
                });
            }

            if (data[2][1] !== 0) {
                _.forEach(data[2][1], el => {
                    if (this.users[el[0]] === undefined) {
                        const user = new User(el);

                        this.addUser(user);

                        // if user have ship
                        if (el[3]) {
                            user.setShip(this.bodies[el[3]]);
                        }
                    }
                });
            }

            this.state.newData(data[2]);
        }
        // remove data
        if (data[3]) {
            if (data[3][0] !== 0) {
                _.forEach(data[3][0], el => {
                    if (this.bodies[el] !== undefined) {
                        this.bodies[el].destroy();
                    } else {
                        console.log('Error remove data ' + el);
                    }
                });
            }

            this.state.removeData(data[2]);
        }
    }

    updateFromDataServer(now) {
        if (this.dataFromServer.length > 0) {
            // данные по времени пришедшие с сервера добавим в очередь
            this.updateData = this.updateData.concat(this.dataFromServer);
            this.dataFromServer = [];
        }

        // Данные могли прийти не в том порядка, в котором отправил сервер
        // Сортируем по времени
        this.updateData = _.sortBy(this.updateData, 0);

        // формируем массив данных для обновления
        const arrData = [];
        _.forEach(this.updateData, el => {
            if (el[0] < now - this.ping) {
                arrData.push(el);
            }
        });

        const arrDataLen = arrData.length;

        if (arrDataLen > 0) {
            this.updateData = this.updateData.slice(arrDataLen);
            _.forEach(arrData, data => this.updateImportant(data));

            const lastData = arrData[arrDataLen - 1];

            const dt = (lastData[0] + this.ping - this.lastGameStepTime) / 1000;
            if (dt > 0) {
                if (this.isEnable) {
                    this.world.step(dt);
                }
                step.go(dt);
            }

            _.forEach(lastData[1][0], el => {
                if (this.bodies[el[0]] !== undefined) {
                    this.bodies[el[0]].update(lastData[0], el);
                }
            });

            this.lastGameStepTime = lastData[0] + this.ping;
        }
    }

    worldStep(now) {
        let dt;
        // world step до времени последней информации с сервера
        // синхронизируем с посленей информацией
        // делаем степ до конца
        this.updateFromDataServer(now);

        dt = (now - this.lastGameStepTime) / 1000;
        if (dt !== 0) {
            if (this.isEnable) {
                this.world.step(dt);
            }
            step.go(dt);
        }
    }

    start(options) {
        ping.on();
        this.serverSendStateInterval = options.game.sendStateInterval;

        this.world = new p2.World({
            gravity: options.game.world.gravity,
            applyDamping: options.game.world.applyDamping
        });

        // create camera
        this.camera = camera.create(render.resolution[0], render.resolution[1]);
        camera.set(this.camera);

        // create background
        background.create(this);

        // создаем объекты в космосе
        _.forEach(options.game.bodies, el => {
            this.addBody(body.create(el));
        });

        // создаем и сохраняем юзеров
        _.forEach(options.game.users, (el) => {
            let user = new User(el);
            this.addUser(user);

            // if user have ship
            if (el[3]) {
                user.setShip(this.bodies[el[3]]);
            }
        });

        request.onGameClose(this.close.bind(this));
        this.disconnectEnable();

        this.state.start({changeStatusData: options});

        this.updateFromServerEnable();

        setTimeout(() => {
            ping.reset();
        }, 0);

        this.loop();
    }

    update(now) {
        this.ping = ping.get() / 2;
        this.camera.update();

        _.forEach(this.bodies, function(el) {
            el.updateSprite(now);
        });

        background.update();

        this.state.update(now);

        player.sendActionToServer();

        key.reset();
    }

    render() {
        this.state.render();
    }

    changeState(state, options) {
        if (this.state !== null) {
            this.state.close();
            state.start(options);
        }
        this.state = state;
    }

    close() {
        this.isEnable = false;
    }

    disconnectEnable() {
        request.disconnect(() => {
            this.isEnable = false;
        });

        request.reconnect(() => {
            this.isEnable = true;
        });
    }
}

export default new Game();
