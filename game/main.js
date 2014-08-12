var _ = require('lodash');
var Game = require('./game');
var User = require('./user');
var body = require('./body/index');
var config = require('./config');
var io = require('../modules/socket').io;


// инициализация единственной пока что игры
var game = new Game();
game.start();

// добавим астероид в игру
var asteroid = body.create({
    type: 1,
    position: [0, 0],
    velocity: [0, 0],
    angularVelocity: 0.53
});

game.addBody(asteroid);

game.addBody(body.create({
    type: 1,
    position: [500, 10],
    velocity: [0, 0],
    angularVelocity: -0.1
}));

game.addBody(body.create({
    type: 0,
    position: [10, 1000],
    velocity: [50, -150],
    angularVelocity: 0.5,
    mass: 5
}));

var start = function (server) {
    io.sockets.on('connection', function (socket) {
        var user;

        // клиент загрузился
        socket.once('clientOnLoad', function() {
            //user = new User(socket);
            //user.createShip();
            //game.addUser(user);

            //game.addBody(user.ship);
            //user.send('firstGameState', game.getGameFirstState(user));

            socket.emit('firstGameState', game.getGameFirstState());
        });

        socket.on('playerActions', function(data) {
            if (user !== undefined) {
                _(data).forEach(function (el) {
                    user.action(el);
                });
            }
        });
    });
};

exports.start = start;