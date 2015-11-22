var socketio = require('socket.io');
var config = require('../config');
var log = require('../modules/log')(module);
var clients = require('../clients');

var io;

exports.initialize = function (server) {
    io = socketio.listen(server, {log: true});
    //io.set('origins', config.host + ':' + config.port);
    log.info('socket.io initialized');

    io.sockets.on('connection', function (socket) {
        log.silly('New socket connection');
        clients.initialize(socket);
    });
};

exports.io = function() {
    return io;
};


