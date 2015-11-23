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
import * as body from '../body';

let game = {};

// p2.js world
game.world;
// все тела p2.js
game.bodies = {};
// все подключенные юзеры
game.users = {};

game.camera;

// фон игры
game.background;

game.lastGameStepTime;

game.dataFromServer = [];
game.updateData = [];
game.ping = ping.get();

// минимальный интервал через который сервер посылает данные
game.serverSendStateInterval = 0;

// игровое состояние
game.state;

game.isEnable = true;

game.loop = function() {
    var _this = this;
    var now = Date.now();

    if (now < this.lastGameStepTime) {
        return;
    }

    // шаг мира p2.js

    this.worldStep(now);

    // производим различные действия для нового шага
    this.update(now);

    // отрисовываем сцену
    render.draw();

    this.lastGameStepTime = now;


    requestAnimFrame(function() {
        _this.loop();
    });

    this.render();
};

game.addUser = function(user) {
    this.users[user.id] = user;
};

game.removeUser = function(user) {
    if (this.users[user.id] !== undefined) {
        delete this.users[user.id];
    }
};

game.addBody = function(body) {
    this.bodies[body.id] = body;
    body.addToGame(this);
};

game.removeBody = function(body) {
    delete this.bodies[body.id];
    body.removeFromGame();
};

game.load = function(options, callback) {
    this.lastGameStepTime = Date.now();

    assets.load(options.game.assets, callback);
};

game.updateFromServerEnable = function() {
    var _this = this;

    request.onUpdateGameState(function(data) {
        data[0] += ping.dt();
        _this.dataFromServer.push(data);
    });
};

// обновить только важную информацию об игре (вход, выход игроков и пр.) их данных с сервера
game.updateImportant = function(data) {
    var _this = this,
        now = data[0] + this.ping;
    // actions data
    _.forEach(data[1][0], function(el) {
        if (_this.bodies[el[0]] !== undefined) {
            _this.bodies[el[0]].updateActions(now, el);
        }
    });
    // new data
    if (data[2]) {
        if (data[2][0] !== 0) {
            _.forEach(data[2][0], function (el) {
                if (_this.bodies[el[0]] === undefined) {
                    _this.addBody(body.create(el));
                }
            });
        }
        if (data[2][1] !== 0) {
            _.forEach(data[2][1], function (el) {
                var user;

                if (_this.users[el[0]] === undefined) {
                    user = new User(el);

                    _this.addUser(user);

                    // if user have ship
                    if (el[3]) {
                        user.setShip(_this.bodies[el[3]]);
                    }
                }
            });
        }

        this.state.newData(data[2]);
    }
    // remove data
    if (data[3]) {
        if (data[3][0] !== 0) {
            _.forEach(data[3][0], function (el) {
                if (_this.bodies[el] !== undefined) {
                    _this.bodies[el].destroy();
                } else {
                    console.log('Error remove data ' + el);
                }
            });
        }

        this.state.removeData(data[2]);
    }
};

game.updateFromDataServer = function(now) {
    var _this = this,
        arrData, arrDataLen, lastData, dt;

    if (this.dataFromServer.length > 0) {
        // данные по времени пришедшие с сервера добавим в очередь
        this.updateData = this.updateData.concat(this.dataFromServer);
        this.dataFromServer = [];
    }

    this.updateData = _.sortBy(this.updateData, 0);
    // формируем массив данных для обновления
    arrData = [];
    _.forEach(this.updateData, function(el, i) {
        if (el[0] < now - _this.ping) {
            arrData.push(el);
            //console.log(now - _this.ping - el[0]);
        }
    });

    arrDataLen = arrData.length;
    if (arrDataLen > 0) {
        this.updateData = this.updateData.slice(arrDataLen);
        _.forEach(arrData, function (data) {
            _this.updateImportant(data);
        });

        lastData = arrData[arrDataLen - 1];

        dt = (lastData[0] + this.ping - this.lastGameStepTime) / 1000;
        if (dt > 0) {
            if (this.isEnable) {
                this.world.step(dt);
            }
            step.go(dt);
        }

        _.forEach(lastData[1][0], function (el) {
            if (_this.bodies[el[0]] !== undefined) {
                _this.bodies[el[0]].update(lastData[0], el);
            }
        });

        this.lastGameStepTime = lastData[0] + this.ping;
    }
};

game.worldStep = function(now) {
    var dt;
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
};

game.start = function(options) {
    var _this = this;

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
    _.forEach(options.game.bodies, function(el) {
        _this.addBody(body.create(el));
    });

    // создаем и сохраняем юзеров
    _.forEach(options.game.users, function(el) {
        var user = new User(el);
        _this.addUser(user);

        // if user have ship
        if (el[3]) {
            user.setShip(_this.bodies[el[3]]);
        }
    });

    request.onGameClose(_.bind(this.close, this));
    this.disconnectEnable();

    this.state.start({changeStatusData: options});

    this.updateFromServerEnable();
    this.loop();
};

game.update = function(now) {
    this.ping = ping.get() / 2;
    this.camera.update();

    _.forEach(game.bodies, function(el) {
        el.updateSprite(now);
    });

    background.update();

    this.state.update(now);

    player.sendActionToServer();

    key.reset();
};

game.render = function() {
    this.state.render();
};

game.changeState = function(state, options) {
    if (this.state !== undefined) {
        this.state.close();
        state.start(options);
    }
    this.state = state;
};

game.close = function() {
    this.isEnable = false;
};

game.disconnectEnable = function() {
    var _this = this;

    request.disconnect(function() {
        _this.isEnable = false;
    });

    request.reconnect(function() {
        _this.isEnable = true;
    });
};

export {game as default};
