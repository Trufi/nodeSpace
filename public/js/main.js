/*var socket = io.connect('http://localhost');

socket.on('playerIsConnect', function (data) {
    console.log('playerConnect' + data);

    setInterval(function () {
        socket.emit('update', playerShip.position);
    }, 1000);
});*/

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamewrap', {preload: preload, create: create, update: update, render: render});

var players = {};
var socket;
var playerShip;
var graphics;
var cursors;
var keyboard;
var worldSize = [5000, 5000];
var background;
var asteroid,
    asteroid2;

function preload() {
    game.load.image('background', 'img/bg2.png');
    game.load.image('ship', 'img/ship2.png');
    game.load.image('asteroid', 'img/asteroid.png');
    game.load.image('asteroid2', 'img/asteroid2.png');
    game.load.physics('physicsData', 'js/asteroid_polygon.json');
}

function create() {
    var i;

    socket = io.connect('http://localhost');

    game.world.setBounds(0, 0, worldSize[0], worldSize[1]);
    background = game.add.tileSprite(0, 0, worldSize[0], worldSize[1], 'background');

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.world.applyDamping = false;
    game.physics.p2.useElapsedTime = true;

    game.time.advancedTiming = true;

    graphics = game.add.graphics(0, 0);
    cursors = game.input.keyboard.createCursorKeys();
    keyboard = game.input.keyboard;

    // create player ship
    playerShip = new Ship();
    game.camera.follow(playerShip.sprite);

    // asteroids
    for (i = 0; i < 30; i++) {
        createAsteroid([Math.random() * worldSize[0], Math.random() * worldSize[1]]);
    }
    for (i = 0; i < 30; i++) {
        createAsteroid2([Math.random() * worldSize[0], Math.random() * worldSize[1]]);
    }

    socket.on('updateClient', function (data) {
        console.log(data);
        players = data;
    });

    setInterval(function () {
        var obj = {
            position: {
                x: playerShip.getX(),
                y: playerShip.getY()
            }
        };

        socket.emit('update', obj);
    }, 1000);
}

function update() {
    graphics.clear();

    if (cursors.left.isDown || keyboard.isDown(Phaser.Keyboard.A)) {
        playerShip.left();
    }

    if (cursors.right.isDown || keyboard.isDown(Phaser.Keyboard.D)) {
        playerShip.right();
    }

    if (cursors.up.isDown || keyboard.isDown(Phaser.Keyboard.W)) {
        playerShip.thrust();
    }

    if (cursors.down.isDown || keyboard.isDown(Phaser.Keyboard.S)) {
        playerShip.reverse();
    }

    if (keyboard.isDown(Phaser.Keyboard.Q)) {
        playerShip.strafeLeft();
    }

    if (keyboard.isDown(Phaser.Keyboard.E)) {
        playerShip.strafeRight();
    }

    // TODO: если идет стрейф, то его регулировать
    if (!cursors.left.isDown && !cursors.right.isDown && !keyboard.isDown(Phaser.Keyboard.A) && !keyboard.isDown(Phaser.Keyboard.D)) {
        playerShip.brakingAngularVelocity(keyboard.isDown(Phaser.Keyboard.CONTROL));
    }

    var el;
    for (var i in players) {
        el = players[i];
        graphics.lineStyle(25, 0xFF1600, 1);
        graphics.beginFill();
        graphics.moveTo(el.position.x, el.position.y);
        graphics.lineTo(el.position.x + 10, el.position.y + 10);
        graphics.endFill();
    }
}

function render() {
    game.debug.spriteInfo(playerShip.sprite, 32, 500);
    game.debug.text('fps:' + game.time.fps, 32, 400);
    /*game.debug.text('physicsElapsed:' + game.time.physicsElapsed, 32, 450);*/
}