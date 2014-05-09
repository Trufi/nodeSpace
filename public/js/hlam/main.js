var utils = {};
// Server p2.js to phaser p2.js
utils.sxp = function(val) {
    return -val;
}
// Phaser p2.js to server p2.js
utils.pxs = function(val) {
    return -val;
}

var firstData;

socket = io.connect('http://localhost');
socket.on('playerIsConnect', function (data) {
    firstData = data;

    game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamewrap', {preload: preload, create: create, update: update, render: render});
});

var game;

var players = {};
var socket;
var playerShip;
var graphics;
var cursors;
var keyboard;
var worldSize = [5000, 5000];
var background;

var asteroids = {};

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
    /*playerShip = new Ship();
    game.camera.follow(playerShip.sprite);*/

    // asteroids
/*    for (i = 0; i < 30; i++) {
        createAsteroid([Math.random() * worldSize[0], Math.random() * worldSize[1]]);
    }
    for (i = 0; i < 30; i++) {
        createAsteroid2([Math.random() * worldSize[0], Math.random() * worldSize[1]]);
    }*/

    socket.on('updateClient', function (data) {
        asteroids = data;
    });

    var i, el;
    for (i in firstData) {
        el = firstData[i];
        if (el.type === 0) {
            asteroid = createAsteroidFromDate(el);
        }
    }


 /*   setInterval(function () {
        var obj = {
            position: {
                x: playerShip.getX(),
                y: playerShip.getY()
            }
        };

        socket.emit('update', obj);
    }, 20);*/
}

function update() {
    if ((typeof asteroids[0] !== 'undefined') && asteroid) {
        asteroid.body.data.position[0] = -asteroids[0].position[0];
        asteroid.body.data.position[1] = -asteroids[0].position[1];
        asteroid.body.rotation = asteroids[0].angle;
       // asteroid.body.data.velocity = asteroids[0].velocity;
        asteroid.body.angularVelocity = asteroids[0].angularVelocity;
    }


    /*  graphics.clear();
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
    }*/

}

function render() {
    //game.debug.spriteInfo(asteroid, 32, 500);
    game.debug.text('fps:' + game.time.fps, 32, 400);
    /*game.debug.text('physicsElapsed:' + game.time.physicsElapsed, 32, 450);*/
}