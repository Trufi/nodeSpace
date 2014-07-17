var socketio = require('socket.io');

var request = {};

var io;

request.init = function (server) {
    io = socketio.listen(server, {log: false});

    io.sockets.on('connection', function (socket) {
        game.init(socket);
    });
};

request.onConnection = function(callback) {
    io.sockets.on('connection', function (socket) {
        callback(socket);
    });
};

request.socketsOn = function(event, listener) {
    io.on(event, listener);
};

module.exports = request;