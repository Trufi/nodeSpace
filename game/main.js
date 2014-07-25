var Game = require('./game');
var User = require('./user');
var body = require('./body/index');

var socketio = require('socket.io');

// инициализация единственной пока что игры
var game = new Game();
game.start();

// добавим астероид в игру
var asteroid = body.create({
    type: 1,
    position: [10, 0],
    velocity: [0, 0],
    angularVelocity: 0.53
});
game.addBody(asteroid);

game.addBody(body.create({
    type: 1,
    position: [500, 10],
    velocity: [-5, 0],
    angularVelocity: -0.1
}));

game.addBody(body.create({
    type: 0,
    position: [10, 1000],
    velocity: [50, -150],
    angularVelocity: 0.5,
    mass: 5
}));

var init = function (server) {
    var io = socketio.listen(server, {log: false});

    io.sockets.on('connection', function (socket) {
        var user = new User(socket);
        game.addUser(user);
    });
};

module.exports.init = init;