var Game = require('./game');
var User = require('./user');
var Body = require('./body');

var socketio = require('socket.io');

// инициализация единственной пока что игры
var game = new Game();
game.start();

// добавим астероид в игру
var asteroid = new Body();
game.addBody(asteroid);

var init = function (server) {
    var io = socketio.listen(server, {log: false});

    io.sockets.on('connection', function (socket) {
        var user = new User(socket);
        game.addUser(user);
    });
};

module.exports.init = init;