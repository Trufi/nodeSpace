define(
    'game/game',
    ['json!config', 'p2'],
    function(config, p2) {
        var game = {};

        game.phaserGame = undefined;
        game.world = undefined;
        game.interval = undefined;
        game.timeStep = undefined;
        game.gravity = undefined;
        game.applyDamping = undefined;

        game.users = {};
        game.bodies = {};

        game.start = function(data, preload, create, update, render) {
            game.timeStep = data.world.timeStep;
            game.gravity = data.world.gravity;
            game.applyDamping = data.world.applyDamping;

            this.phaserGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, config.gameHtmlWrapId, {
                preload: preload,
                create: create,
                update: update,
                render: render
            });

            this.world = new p2.World({
                gravity: game.gravity,
                applyDamping: game.applyDamping
            });

            this.interval = setInterval(function() {
                game.world.step(game.timeStep);
            }, 1000 * game.timeStep);
        };

        game.updateBodiesSprite = function() {
            var i;

            for (i in this.bodies) {
                this.bodies[i].updateSprite();
            }
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