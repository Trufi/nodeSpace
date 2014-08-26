// Родитель для всех типов игр
// Не класс!
define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var _ = require('lodash');
        var camera = require('modules/camera');
        var render = require('modules/render');
        var assets = require('modules/assets');
        var request = require('modules/request');
        var User = require('modules/user');
        var key = require('modules/key');
        var player = require('modules/player');
        var body = require('body/index');
        var ping = require('modules/ping');

        var game = {};

        // p2.js world
        game.world;
        // все тела p2.js
        game.bodies = {};
        // все подключенные юзеры
        game.users = {};
        // stage из pixi.js
        game.stage;
        game.layers = [];

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
            if (!this.isEnable) return;

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
            render.draw(this.stage);

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

        game.createBackground = function(texture) {
            this.background = [];

            var scale = this.camera.scale;
            this.background[0] = new PIXI.TilingSprite(assets.texture.bg_0, render.resolution[0] / scale, render.resolution[1] / scale);
            this.background[0].position.x = 0;
            this.background[0].position.y = 0;
            this.background[0].tilePosition.x = 0;
            this.background[0].tilePosition.y = 0;
            //this.background[0].scale = new PIXI.Point(scale, scale);
            this.layers[0].addChild(this.background[0]);

            this.background[1] = new PIXI.TilingSprite(assets.texture.bg_1, render.resolution[0] / scale, render.resolution[1] / scale);
            this.background[1].position.x = 0;
            this.background[1].position.y = 0;
            this.background[1].tilePosition.x = 0;
            this.background[1].tilePosition.y = 0;
            //this.background[1].scale = new PIXI.Point(scale, scale);
            this.layers[0].addChild(this.background[1]);

            this.background[2] = new PIXI.TilingSprite(assets.texture.bg_2, render.resolution[0] / scale, render.resolution[1] / scale);
            this.background[2].position.x = 0;
            this.background[2].position.y = 0;
            this.background[2].tilePosition.x = 0;
            this.background[2].tilePosition.y = 0;
            this.background[2].scale = new PIXI.Point(scale, scale);
            this.layers[0].addChild(this.background[2]);

            this.background[3] = new PIXI.TilingSprite(assets.texture.bg_3, render.resolution[0] / scale, render.resolution[1] / scale);
            this.background[3].position.x = 0;
            this.background[3].position.y = 0;
            this.background[3].tilePosition.x = 0;
            this.background[3].tilePosition.y = 0;
            this.background[3].scale = new PIXI.Point(scale, scale);
            this.layers[0].addChild(this.background[3]);
        };

        game.updateBackground = function() {
            var bgSc = 0.05;
            var scale = 1 + bgSc * (this.camera.scale - 1);
            this.background[0].width = render.resolution[0] / scale;
            this.background[0].height = render.resolution[1] / scale;
            this.background[0].scale = new PIXI.Point(scale, scale);
            this.background[0].tilePosition.x = render.resolution[0] * (1 / scale - 1) / 2  - this.camera.position[0] * bgSc;
            this.background[0].tilePosition.y = render.resolution[1] * (1 / scale - 1) / 2  - this.camera.position[1] * bgSc;

            bgSc = 0.1;
            scale = 1 + bgSc * (this.camera.scale - 1);
            this.background[1].width = render.resolution[0] / scale;
            this.background[1].height = render.resolution[1] / scale;
            this.background[1].scale = new PIXI.Point(scale, scale);
            this.background[1].tilePosition.x = render.resolution[0] * (1 / scale - 1) / 2 - this.camera.position[0] * bgSc;
            this.background[1].tilePosition.y = render.resolution[1] * (1 / scale - 1) / 2 - this.camera.position[1] * bgSc;

            bgSc = 0.2;
            scale = 1 + bgSc * (this.camera.scale - 1);
            this.background[2].width = render.resolution[0] / scale;
            this.background[2].height = render.resolution[1] / scale;
            this.background[2].scale = new PIXI.Point(scale, scale);
            this.background[2].tilePosition.x = render.resolution[0] * (1 / scale - 1) / 2  - this.camera.position[0] * bgSc;
            this.background[2].tilePosition.y = render.resolution[1] * (1 / scale - 1) / 2  - this.camera.position[1] * bgSc;

            scale = this.camera.scale;
            if (scale > 0.47) {
                this.background[3].width = render.resolution[0] / scale;
                this.background[3].height = render.resolution[1] / scale;
                this.background[3].scale = new PIXI.Point(scale, scale);
                this.background[3].tilePosition.x = render.resolution[0] * (1 / scale - 1) / 2 - this.camera.position[0];
                this.background[3].tilePosition.y = render.resolution[1] * (1 / scale - 1) / 2 - this.camera.position[1];
                this.background[3].visible = true;
            } else {
                this.background[3].visible = false;
            }
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
            _(data[1][0]).forEach(function(el) {
                if (_this.bodies[el[0]] !== undefined) {
                    _this.bodies[el[0]].updateActions(now, el);
                }
            });
            // new data
            if (data[2]) {
                if (data[2][0] !== 0) {
                    _(data[2][0]).forEach(function (el) {
                        if (_this.bodies[el[0]] === undefined) {
                            _this.addBody(body.create(el));
                        }
                    });
                }
                if (data[2][1] !== 0) {
                    _(data[2][1]).forEach(function (el) {
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
            }
            // remove data
            if (data[3]) {
                if (data[3][0] !== 0) {
                    _(data[3][0]).forEach(function (el) {
                        if (_this.bodies[el] !== undefined) {
                            _this.bodies[el].destroy();
                        } else {
                            console.log('Error remove data ' + el);
                        }
                    });
                }
            }
        };

        game.updateFromDataServer = function(now) {
            var _this = this,
                arrData, arrDataLen, lastData;

            if (this.dataFromServer.length > 0) {
                // данные по времени пришедшие с сервера добавим в очередь
                this.updateData = this.updateData.concat(this.dataFromServer);
                this.dataFromServer = [];
            }

            this.updateData = _.sortBy(this.updateData, 0);
            // формируем массив данных для обновления
            arrData = [];
            _(this.updateData).forEach(function(el, i) {
                if (el[0] < now - _this.ping) {
                    arrData.push(el);
                    //console.log(now - _this.ping - el[0);
                }
            });

            arrDataLen = arrData.length;
            if (arrDataLen > 0) {
                this.updateData = this.updateData.slice(arrDataLen);
                _.forEach(arrData, function (data) {
                    _this.updateImportant(data);
                });

                lastData = arrData[arrDataLen - 1];
                _(lastData[1][0]).forEach(function (el) {
                    if (_this.bodies[el[0]] !== undefined) {
                        _this.bodies[el[0]].update(lastData[0], el);
                    }
                });

                this.lastGameStepTime = lastData[0] + this.ping;
            }
        };

        game.worldStep = function(now) {
            this.updateFromDataServer(now);

            if (now !== this.lastGameStepTime) {
                this.world.step((now - this.lastGameStepTime) / 1000);
            }
        };

        game.start = function(options) {
            var _this = this;
            var i;

            ping.on();
            this.serverSendStateInterval = options.game.sendStateInterval;

            this.world = new p2.World({
                gravity: options.game.world.gravity,
                applyDamping: options.game.world.applyDamping
            });

            this.stage = new PIXI.Stage(0x000000);
            for (i = 0; i < 5; i++) {
                this.layers[i] = new PIXI.DisplayObjectContainer();
                this.stage.addChild(this.layers[i]);
            }

            // create camera
            this.camera = camera.create(render.resolution[0], render.resolution[1]);
            camera.set(this.camera);

            // create background
            this.createBackground(assets.texture.background);

            // создаем объекты в космосе
            _(options.game.bodies).forEach(function(el) {
                _this.addBody(body.create(el));
            });

            // создаем и сохраняем юзеров
            _(options.game.users).forEach(function(el) {
                var user = new User(el);
                _this.addUser(user);

                // if user have ship
                if (el[3]) {
                    user.setShip(_this.bodies[el[3]]);
                }
            });

            request.onGameClose(_.bind(this.close, this));

            this.state.start({changeStatusData: options});

            this.updateFromServerEnable();
            this.loop();
        };

        game.update = function(now) {
            this.ping = ping.get() / 2;
            this.camera.update();

            _(game.bodies).forEach(function(el) {
                el.updateSprite(now);
            });

            this.updateBackground();

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

        return game;
    }
);