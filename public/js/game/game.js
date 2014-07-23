define(
    'game/game',
    ['json!config', 'p2', 'pixi', 'game/assets', 'game/camera'],
    function(config, p2, PIXI, assets, camera) {
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

        var gameStep = function(time) {
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

            this.interval = setInterval(function() {
                game.world.step(game.timeStep);
                camera.update();
            }, 1000 * game.timeStep);

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
            body.addToWorld();
        };

        game.removeBody = function(body) {
            if (typeof this.bodies[body.id] !== 'undefined') {
                delete this.bodies[body.id];
                // TODO: sprite and p2 remove
            }
        };

        game.setBackground = function(texture) {
            if (typeof this.background === 'undefined') {
                this.background = new PIXI.TilingSprite(texture, game.resolution[0], game.resolution[1]);
                this.background.position.x = 0;
                this.background.position.y = 0;
                this.background.tilePosition.x = 0;
                this.background.tilePosition.y = 0;
                this.stage.addChild(this.background);
            } else {
                this.background.setTexture(texture);
            }
        };

        return game;
    }
);