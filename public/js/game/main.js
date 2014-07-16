define(
    'game/main',
    ['game/request', 'game/game', 'game/asteroids'],
    function(request, gameGame, modAsteroids) {
        var game,
            firstData,
            asteroids,
            graphics,
            cursors,
            background,
            keyboard,
            worldSize = [5000, 5000];

        request.gameInit(function(data) {
            firstData = data;

            game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'gamewrap', {
                preload: preload,
                create: create,
                update: update,
                render: render
            });
        });



        function preload() {
            game.load.image('background', 'img/bg2.png');
            game.load.image('ship', 'img/ship2.png');
            game.load.image('asteroid', 'img/asteroid.png');
            game.load.image('asteroid2', 'img/asteroid2.png');
            game.load.physics('physicsData', 'js/game/asteroid_polygon.json');
        }

        function create() {
            var i, el;

            game.world.setBounds(0, 0, worldSize[0], worldSize[1]);
            background = game.add.tileSprite(0, 0, worldSize[0], worldSize[1], 'background');

            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.world.applyDamping = false;
            game.physics.p2.useElapsedTime = true;

            game.time.advancedTiming = true;
        }

        function update() {}

        function render() {
            game.debug.text('fps:' + game.time.fps, 32, 400);
        }
    }
);