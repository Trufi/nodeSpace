define(
    'game/game',
    ['json!config'],
    function(config) {
        var game = {};

        var phaserGame;
        var worldSize = [5000, 5000];

        game.init = function() {
            phaserGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, config.gameHtmlWrapId, {
                preload: preload,
                create: create,
                update: update,
                render: render
            });
        };

        var preload = function() {
            phaserGame.load.image('background', 'img/bg2.png');
            phaserGame.load.image('ship', 'img/ship2.png');
            phaserGame.load.image('asteroid', 'img/asteroid.png');
            phaserGame.load.image('asteroid2', 'img/asteroid2.png');
            phaserGame.load.physics('physicsData', 'js/game/asteroid_polygon.json');
        };

        var create = function() {
            phaserGame.world.setBounds(0, 0, worldSize[0], worldSize[1]);
            phaserGame.add.tileSprite(0, 0, worldSize[0], worldSize[1], 'background');

            phaserGame.physics.startSystem(Phaser.Physics.P2JS);
            phaserGame.physics.p2.world.applyDamping = false;
            phaserGame.physics.p2.useElapsedTime = true;

            phaserGame.time.advancedTiming = true;
        };

        var update = function() {
            //
        };

        var render = function() {
            phaserGame.debug.text('fps:' + phaserGame.time.fps, 32, 400);
        };

        return game;
    }
);