var _ = require('lodash');
var socketio = require('socket.io');
var config = require('config');
var log = require('modules/log')(module);
var connect = require('connect');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');

var io;

exports.init = function (server) {
    io = socketio.listen(server, {log: false});
    io.set('origins', config.host + ':' + config.port);
    log.info('socket.io initialized');
};

exports.io = function() {
    return io;
};

exports.find = function(sid) {
    var socket = _(io.sockets.clients()).find(function(el) {
        return el.handshake.session.id === sid;
    });

    return socket;
};