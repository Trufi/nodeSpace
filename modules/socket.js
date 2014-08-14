var _ = require('lodash');
var socketio = require('socket.io');
var config = require('config');
var log = require('modules/log')(module);

var io;

exports.init = function (server) {
    io = socketio.listen(server, {log: true});
    io.set('origins', config.host + ':' + config.port);
    log.info('socket.io initialized');
};

exports.io = function() {
    return io;
};

exports.findWithSid = function(sid) {
    /*return _(io.sockets.clients()).find(function(el) {
        return el.handshake.session.id === sid;
    });*/
    var clients = io.sockets.sockets;
    console.log(clients);
};