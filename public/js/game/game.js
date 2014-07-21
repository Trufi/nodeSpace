define(
    'game/game',
    ['json!config', 'p2', 'pixi'],
    function(config, p2, PIXI) {
        var game = {};

        game.phaserGame = undefined;
        game.world = undefined;
        game.interval = undefined;
        game.timeStep = undefined;
        game.gravity = undefined;
        game.applyDamping = undefined;

        game.assets = {};
        game.stage = undefined;
        game.render = undefined;

        game.users = {};
        game.bodies = {};

        var preload = function preload(loadObj, callback) {
            var loadArray = [],
                i, src;

            for (i in loadObj) {
                src = config.pathToAssets + loadObj[i];
                game.assets[i] = src;
                loadArray.push(src);
            }

            var loader = new PIXI.AssetLoader(loadArray);
            loader.onComplete = function() {
                callback();
            };
            loader.load();
        };

        var gameUpdate, gameRender;

        var gameStep = function() {
            var i;

            gameUpdate();
            for (i in game.bodies) {
                game.bodies[i].updateSprite();
            }

            requestAnimFrame(gameStep);
            game.render.render(game.stage);
            gameRender();
        };

        game.start = function(data, create, update, render) {
            this.timeStep = data.world.timeStep;
            this.gravity = data.world.gravity;
            this.applyDamping = data.world.applyDamping;

            // инициализация Pixi.js
            preload(data.assets, function() {
                game.stage = new PIXI.Stage(0x000000);
                game.render = PIXI.autoDetectRenderer(1024, 640);

                game.render.view.style.display = 'block';
                game.render.view.style.width = 1024;
                game.render.view.style.height = 640;

                document.getElementById(config.gameHtmlWrapId).appendChild(game.render.view);

                create();
                gameUpdate = update;
                gameRender = render;
                gameStep();
            });

            // инициализация p2.js
            this.world = new p2.World({
                gravity: game.gravity,
                applyDamping: game.applyDamping
            });

            this.interval = setInterval(function() {
                game.world.step(game.timeStep);
            }, 1000 * game.timeStep);
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
            body.addToWorld();
        };

        game.removeBody = function(body) {
            if (typeof this.bodies[body.id] !== 'undefined') {
                delete this.bodies[body.id];
                // TODO: sprite remove
            }
        };

        return game;
    }
);