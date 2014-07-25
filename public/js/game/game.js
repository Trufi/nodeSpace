define(
    function(require) {
        var config = require('json!config');
        var p2 = require('p2');
        var PIXI = require('pixi');
        var assets = require('game/assets');
        var camera = require('game/camera');
        var request = require('game/request');

        var game = {};

        game.world = undefined;
        game.interval = undefined;
        game.timeStep = undefined;
        game.gravity = undefined;
        game.applyDamping = undefined;

        game.stage = undefined;
        game.render = undefined;

        game.users = {};
        game.bodies = {};
        game.background = undefined;

        game.resolution = [1024, 768];

        var gameUpdate, gameRender;

        var lastTimeStep;
        var gameStep = function(time) {
            var currentTimeStep = (new Date()).getTime();
            game.world.step((currentTimeStep - lastTimeStep) / 1000);
            camera.update();
            lastTimeStep = currentTimeStep;

            gameUpdate();
            game.render.render(game.stage);
            requestAnimFrame(gameStep);
            gameRender();
        };

        game.start = function(data, create, update, render) {
            this.timeStep = data.world.timeStep;
            this.gravity = data.world.gravity;
            this.applyDamping = data.world.applyDamping;

            // инициализация p2.js
            this.world = new p2.World({
                gravity: game.gravity,
                applyDamping: game.applyDamping
            });

            lastTimeStep = (new Date()).getTime();

            // подзагрузка файлов и инициализация Pixi.js
            assets.load(data.assets, function() {
                game.stage = new PIXI.Stage(0x000000);
                game.render = PIXI.autoDetectRenderer(game.resolution[0], game.resolution[1]);

                game.render.view.style.display = 'block';
                //game.render.view.style.width = 1024;
                //game.render.view.style.height = 768;

                document.getElementById(config.gameHtmlWrapId).appendChild(game.render.view);

                create(data);
                gameUpdate = update;
                gameRender = render;
                gameStep();

                request.onUpdateGameState(function(data) {
                    _(data.bodies).forEach(function(el) {
                        game.bodies[el.id].update(el);
                    });

                    lastTimeStep = (new Date()).getTime();
                    console.log('bodies was update');
                });
            });
        };

        game.addUser = function(user) {
            this.users[user.id] = user;
        };

        game.removeUser = function(user) {
            if (typeof this.users[user.id] !== 'undefined') {
                delete this.users[user.id];
            }
        };

        game.addBody = function(body) {
            this.bodies[body.id] = body;
            body.addToGame();
        };

        game.removeBody = function(body) {
            if (typeof this.bodies[body.id] !== 'undefined') {
                delete this.bodies[body.id];
                // TODO: sprite and p2 remove
            }
        };

        game.setBackground = function(texture) {
            if (typeof this.background === 'undefined') {
                this.background = new PIXI.TilingSprite(texture, game.resolution[0] / camera.scale(), game.resolution[1] /camera.scale());
                this.background.position.x = 0;
                this.background.position.y = 0;
                this.background.tilePosition.x = 0;
                this.background.tilePosition.y = 0;
                this.stage.addChild(this.background);
                this.background.scale = new PIXI.Point(camera.scale(), camera.scale());
            } else {
                this.background.setTexture(texture);
            }
        };

        return game;
    }
);