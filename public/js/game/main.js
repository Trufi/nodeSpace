define(
    'game/main',
    ['game/request', 'game/game', 'game/bodies'],
    function(request, game, bodies) {
        var worldSize = [5000, 5000];
        var bodiesData = {};

        var preload = function() {
            game.phaserGame.load.image('background', 'img/bg2.png');
            game.phaserGame.load.image('ship', 'img/ship2.png');
            game.phaserGame.load.image('asteroid', 'img/asteroid.png');
            game.phaserGame.load.image('asteroid2', 'img/asteroid2.png');
            game.phaserGame.load.physics('physicsData', 'js/game/asteroid_polygon.json');
        };

        var create = function() {
            var i;

            game.phaserGame.world.setBounds(0, 0, worldSize[0], worldSize[1]);
            game.phaserGame.add.tileSprite(0, 0, worldSize[0], worldSize[1], 'background');

/*            game.phaserGame.physics.startSystem(Phaser.Physics.P2JS);
            game.phaserGame.physics.p2.world.applyDamping = false;
            game.phaserGame.physics.p2.useElapsedTime = true;*/

            game.phaserGame.time.advancedTiming = true;

            for (i in bodiesData) {
                bodies.createTestObj(bodiesData[i].position);
            }
        };

        var update = function() {
            //
        };

        var render = function() {
            game.phaserGame.debug.text('fps:' + game.phaserGame.time.fps, 32, 400);
        };

        request.gameInit(function(data) {
            bodiesData = data;
            game.init(preload, create, update, render);
        });
    }
);