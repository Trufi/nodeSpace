define(
    'game/game',
    ['json!config'],
    function(config, bodies) {
        var game = {};

        game.phaserGame = undefined;

        game.init = function(preload, create, update, render) {
            this.phaserGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, config.gameHtmlWrapId, {
                preload: preload,
                create: create,
                update: update,
                render: render
            });
        };

        return game;
    }
);