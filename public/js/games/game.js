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

        var game = {};

        // p2.js world
        game.world;
        // все тела p2.js
        game.bodies = {};
        // все подключенные юзеры
        game.users = {};
        // stage из pixi.js
        game.stage;

        game.camera;

        // фон игры
        game.background;

        game.lastGameStepTime;

        game.dataFromServer;

        game.dataChangeStatus;

        // игровое состояние
        game.state;

        game.loop = function() {
            var _this = this;
            var currentTime = Date.now();

            //console.log(parseInt(1000 / (currentTime - this.lastGameStepTime), 10));

            if (currentTime < this.lastGameStepTime) {
                return;
            }

            // шаг мира p2.js
            //this.world.step((currentTime - this.lastGameStepTime) / 1000);
            this.worldStep(currentTime);

            // производим различные действия для нового шага
            this.update();

            // отрисовываем сцену
            render.draw(this.stage);

            this.lastGameStepTime = currentTime;


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

        game.createBackground = function(texture) {
            this.background = new PIXI.TilingSprite(texture, render.resolution[0] / this.camera.scale, render.resolution[1] / this.camera.scale);
            this.background.position.x = 0;
            this.background.position.y = 0;
            this.background.tilePosition.x = 0;
            this.background.tilePosition.y = 0;
            this.stage.addChild(this.background);
            this.background.scale = new PIXI.Point(this.camera.scale, this.camera.scale);
        };

        game.updateBackground = function() {
            this.background.width = render.resolution[0] / this.camera.scale;
            this.background.height = render.resolution[1] / this.camera.scale;
            this.background.scale = new PIXI.Point(this.camera.scale, this.camera.scale);
            this.background.tilePosition.x = render.resolution[0] * (1 / this.camera.scale - 1) / 2  - this.camera.position[0];
            this.background.tilePosition.y = render.resolution[1] * (1 / this.camera.scale - 1) / 2  - this.camera.position[1];

            /*this.background.tilePosition.x = -this.camera.position[0];
            this.background.tilePosition.y = -this.camera.position[1];*/
        };

        game.load = function(options, callback) {
            this.lastGameStepTime = Date.now();

            assets.load(options.game.assets, callback);
        };

        game.updateFromServerEnable = function() {
            var _this = this;

            request.onUpdateGameState(function(data) {
                _this.dataFromServer = data;
                _this.dataFromServer.time = Date.now();
            });
        };

        game.updateFromDataServer = function() {
            var _this = this;
            var data = this.dataFromServer;

            this.lastGameStepTime = data.time;

            _(data.bodies).forEach(function(el) {
                if (_this.bodies[el.id] !== undefined) {
                    _this.bodies[el.id].update(el);
                }
            });

            if (data.newData !== undefined) {
                _(data.newData.bodies).forEach(function(el) {
                    if (_this.bodies[el.id] === undefined) {
                        _this.addBody(body.create(el));
                    }
                });

                _(data.newData.users).forEach(function(el) {
                    if (_this.users[el.id] === undefined) {
                        _this.addUser(new User(el));
                    }
                });
            }
        };

        game.worldStep = function(currentTime) {
            if (this.dataFromServer !== undefined) {
                this.updateFromDataServer();
                this.dataFromServer = undefined;
            }

            if (currentTime !== this.lastGameStepTime) {
                this.world.step((currentTime - this.lastGameStepTime) / 1000);
            }
        };

        game.start = function(options) {
            var _this = this;

            this.world = new p2.World({
                gravity: options.game.world.gravity,
                applyDamping: options.game.world.applyDamping
            });

            this.stage = new PIXI.Stage(0x000000);

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
                if (el.shipId !== undefined) {
                    user.setShip(_this.bodies[el.shipId]);
                }
            });

            request.changeStatus(function(data) {
                _this.dataChangeStatus = data;
            });

            this.state.start(options);

            this.updateFromServerEnable();
            this.loop();
        };

        game.update = function() {
            this.camera.update();

            _(game.bodies).forEach(function(el) {
                el.updateSprite();
            });

            if (this.dataChangeStatus !== undefined) {
                this.state.changeStatus(this.dataChangeStatus);
                this.dataChangeStatus = undefined;
            }

            this.updateBackground();

            this.state.update();

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

        return game;
    }
);