var _ = require('lodash');
var socketio = require('socket.io');
var config = require('config');
var log = require('modules/log')(module);
var sessionStore = require('./sessionstore');
var socketHandshake = require('socket.io-handshake');
var cookieParser = require('cookie-parser');

var io;

exports.init = function (server) {
    io = socketio.listen(server, {log: true});
    io.set('origins', config.host + ':' + config.port);
/*    io.use(socketHandshake({
        store: sessionStore,
        key: config.session.key,
        secret: config.session.secret,
        parser: cookieParser
    }));*/
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