var p2game = require('./p2game');

var socketio = require('socket.io');
//var game = require('../game/game');

var init = function (server) {
    var io = socketio.listen(server, {log: false});

    io.sockets.on('connection', function (socket) {
        game.init(socket);
    });
};

exports.init = init;