var socketio = require('socket.io');

var log = require('../modules/log')(module);
var config = require('../config');
var clients = require('../clients');

var io;

exports.initialize = function(server) {
    io = socketio.listen(server, {log: true});
    log.info('socket.io initialized');

    io.sockets.on('connection', socket => {
        log.silly('New socket connection');
        clients.initialize(socket);
    });
};

exports.io = function() {
    return io;
};
