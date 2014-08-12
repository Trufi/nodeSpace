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

/*    io.set('authorization', function(handshake, callback) {
        handshake.cookies = cookie.parse(handshake.headers.cookie || '');
        var sidCookie = handshake.cookies[config.session.key];
        //console.log(sidCookie);
        //var sid =  connect.utils.parseSignedCookie(sidCookie, config.session.secret);
        console.log(connect.hash);
    });*/

    log.info('socket.io initialized');
};

exports.io = function() {
    return io;
};