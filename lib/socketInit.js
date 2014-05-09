var game = require('../game');

var socketio = require('socket.io');

var init = function (server) {
    var io = socketio.listen(server, {log: false});

    io.sockets.on('connection', function (socket) {
        game.init(socket);
    });
};

exports.init = init;