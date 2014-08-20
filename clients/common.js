var config = require('config');
var sessionStore = require('mongo/sessionStore');
var cookieParser = require('cookie-parser')(config.session.secret);
var mongo = require('mongo');

var common = {};

common.loadSession = function(sid, callback) {
    sessionStore.load(sid, function(err, session) {
        if (arguments.length === 0) {
            callback(null, null);
        } else if (arguments.length === 1) {
            callback(err);
        } else {
            callback(null, session);
        }
    });
};

common.getSid = function(socket) {
    var sid;

    // код синхронный
    cookieParser(socket.handshake, null, function() {
        sid = socket.handshake.signedCookies[config.session.key];
    });

    return sid;
};

common.loadUserFromDb = function(name, callback) {
    mongo.users.findOne({name: name}, function(err, doc) {
        if (err) return callback(err);
        if (!doc) return callback(new Error('Document is null, username: ' + name));
        callback(null, doc);
    });
};

module.exports = common;