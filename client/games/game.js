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
import config from '../config.json';

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

        this._serverData = [];

        // игровое состояние
        this.state = null;

        this.isEnable = true;

        this._noTimeServerData = [];

        this._sendStateInterval = config.sendStateInterval;
        this._sendStateLastTime = 0;

        this.loop = this.loop.bind(this);
    }

    loop() {
        requestAnimationFrame(this.loop);

        this._interpolationDelay = config.interpolationDelay + ping.get();

        const now = time() - this._interpolationDelay;

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
            if (!ping.readyToUse()) {
                this._noTimeServerData.push(data);
                return;
            }

            // Время сервера отличается от времени клиента
            // Подправляем
            data.time += ping.dt();

            this._serverData.push(data);
        });
    }

    // обновить только важную информацию об игре (вход, выход игроков и пр.) их данных с сервера
    updateImportant(data) {
        const now = data.time - this._interpolationDelay;

        // actions and important data
        _.forEach(data.changed.bodies, el => {
            if (this.bodies[el.id]) {
                this.bodies[el.id].updateActions(now, el);
                this.bodies[el.id].updateImportant(now, el);
            }
        });

        // new data
        if (data.new) {
            _.forEach(data.new.bodies, el => {
                if (!this.bodies[el.id]) {
                    this.addBody(body.create(el));
                }
            });

            _.forEach(data.new.users, el => {
                if (!this.users[el.id]) {
                    const user = new User(el);

                    this.addUser(user);

                    // if user have ship
                    if (el.shipId) {
                        user.setShip(this.bodies[el.shipId]);
                    }
                }
            });

            this.state.newData(data.new);
        }
        // remove data
        if (data.removed) {
            _.forEach(data.removed.bodies, el => {
                if (this.bodies[el]) {
                    this.bodies[el].destroy();
                } else {
                    console.log('Error remove data ' + el);
                }
            });

            this.state.removeData(data.removed);
        }
    }

    updateFromDataServer(now) {
        if (this._noTimeServerData.length) {
            _.forEach(this._noTimeServerData, data => this.updateImportant(data));
            this._noTimeServerData = [];
        }

        // Данные могли прийти не в том порядка, в котором отправил сервер
        // Сортируем по времени
        this._serverData = _.sortBy(this._serverData, 0);
        const length = this._serverData.length;

        if (!length) { return; }

        // Обновляем важную информацию, например, вход/выход игроков
        _.forEach(this._serverData, data => this.updateImportant(data));

        if (!this._lastInterpolationData) {
            this._lastInterpolationData = this._serverData[0];
        }

        // Если последняя точка интерполяции уже прошла, ищем новую
        if (this._lastInterpolationData.time < now) {
            const lastData = this._serverData[length - 1];
            const startData = this._lastInterpolationData;

            this._lastInterpolationData = lastData;

            const startTime = startData.time;
            const endTime = lastData.time;

            if (startTime > endTime) { return; }

            _.forEach(lastData.changed.bodies, (el, i) => {
                const startBodyData = startData.changed.bodies[i];
                const lastBodyData = lastData.changed.bodies[i];
                const id = lastBodyData.id;

                if (this.bodies[id] && startBodyData && lastBodyData) {
                    this.bodies[id].setInterpolation({
                        startTime,
                        endTime,
                        startData: startBodyData,
                        endData: lastBodyData
                    });
                }
            });
        }

        this._serverData = [];
    }

    worldStep(now) {
        this.updateFromDataServer(now);
        this._interpolate(now);

        const dt = (now - this.lastGameStepTime) / 1000;
        if (dt !== 0) {
            if (this.isEnable) {
                this.world.step(dt);

            }
            step.go(dt);
        }
    }

    start(options) {
        ping.on();

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
            const user = new User(el);
            this.addUser(user);

            // if user have ship
            if (el.shipId) {
                user.setShip(this.bodies[el.shipId]);
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
        this.camera.update();

        _.forEach(this.bodies, el => el.updateSprite(now));

        background.update();

        this.state.update(now);

        if (now - this._sendStateLastTime > this._sendStateInterval) {
            player.sendActionToServer();
        }

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

    _interpolate(now) {
        _.forEach(this.bodies, el => el.interpolate(now));
    }
}

export default new Game();
