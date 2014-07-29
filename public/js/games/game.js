// Родитель для всех типов игр
// Не класс!
define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var _ = require('lodash');
        var assets = require('modules/assets');
        var render = require('modules/render');
        var body = require('body/index');
        var User = require('modules/user');
        var camera = require('modules/camera');
        var request = require('modules/request');

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

        // игрок
        game.player;

        game.lastGameStepTime;

        game.dataFromServer;

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

            assets.load(options.assets, callback);
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
            // TODO: возможно dataFromServer надо клонировать

            this.lastGameStepTime = this.dataFromServer.time;

            _(this.dataFromServer.bodies).forEach(function(el) {
                if (_this.bodies[el.id] !== undefined) {
                    _this.bodies[el.id].update(el);
                }
            });

            if (this.dataFromServer.newData !== undefined) {
                _(this.dataFromServer.newData.bodies).forEach(function(el) {
                    if (_this.bodies[el.id] === undefined) {
                        _this.addBody(body.create(el));
                    }
                });

                _(this.dataFromServer.newData.users).forEach(function(el) {
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

            this.world.step((currentTime - this.lastGameStepTime) / 1000);
        };

        game.start = function() {
            this.updateFromServerEnable();

            this.loop();
        };

        game.update = function() {
            this.camera.update();

            key.reset();
        };

        game.render = function() {};

        return game;
    }
);