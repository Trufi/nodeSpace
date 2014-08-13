var _ = require('lodash');
var socketio = require('socket.io');
var config = require('config');
var log = require('modules/log')(module);
var socketSessions = require('socket.io-handshake');

var io;

exports.init = function (server) {
    io = socketio.listen(server, {log: false});
    io.set('origins', config.host + ':' + config.port);
    //io.use(socketSessions());
    log.info('socket.io initialized');
};

exports.io = function() {
    return io;
};

exports.findWithSid = function(sid) {
    return _(io.sockets.clients()).find(function(el) {
        return el.handshake.session.id === sid;
    });
};