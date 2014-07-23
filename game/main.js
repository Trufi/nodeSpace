var Game = require('./game');
var User = require('./user');
var Body = require('./body');

var socketio = require('socket.io');

// инициализация единственной пока что игры
var game = new Game();
game.start();

// добавим астероид в игру
var asteroid = new Body({
    position: [10, 0],
    velocity: [50, -10],
    angularVelocity: 0.53
});
game.addBody(asteroid);

game.addBody(new Body({
    position: [500, 10],
    velocity: [-5, 5],
    angularVelocity: -0.1
}));

var init = function (server) {
    var io = socketio.listen(server, {log: false});

    io.sockets.on('connection', function (socket) {
        var user = new User(socket);
        game.addUser(user);
    });
};

module.exports.init = init;