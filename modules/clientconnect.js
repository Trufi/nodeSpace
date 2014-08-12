var _ = require('lodash');
var io = require('./socket').io();
var log = require('modules/log')(module);
var async = require('async');
var config = require('config');
var User = require('game/user');
var body = require('game/body/index');
var cookieParser = require('cookie-parser')(config.session.secret);
var sessionStore = require('modules/sessionStore');
var db = require('modules/db');

function loadSession(sid, callback) {
    sessionStore.load(sid, function(err, session) {
        if (arguments.length === 0) {
            callback(null, null);
        } else if (arguments.length === 1) {
            callback(err);
        } else {
            callback(null, session);
        }
    });
}

function loadUserFromDB(session, callback) {
    if (db.users === undefined) {
        callback(new Error('db not initialized'));
    } else if (session.username) {
        db.users.find({name: session.username}, function(err, doc) {
            if (err) {
                callback(err);
            }

            callback(null, doc);
        });
    } else {
        callback(new Error('session not have username'));
    }
}

io.sockets.on('connection', function (socket) {
    log.info('User connection');
    var user;

    async.waterfall([
        function(callback) {
            var sid;

            // код синхронный
            cookieParser(socket.handshake, null, function(err) {
                sid = socket.handshake.signedCookies[config.session.key];
            });

            if (sid) {
                log.silly('User\'s sid = ' + sid);
                loadSession(sid, callback);
            } else {
                callback(new Error('sid is empty'));
            }
        },
        function(session, callback) {
            if (!session) {
                callback(new Error('session is empty'));
            } else {
                loadUserFromDB(session, callback);
            }
        },
        function(userDoc) {
            user = new User(userDoc);
        }
    ], function(err) {
        if (!err) {
            log.silly('No error!');
        } else {
            log.silly(err.message);
        }
    });

    // клиент загрузился
    socket.once('clientOnLoad', function() {
        //user = new User(socket);
        //user.createShip();
        //game.addUser(user);

        //game.addBody(user.ship);
        //user.send('firstGameState', game.getGameFirstState(user));

        //socket.emit('firstGameState', game.getGameFirstState());
    });

    socket.on('playerActions', function(data) {
        if (user !== undefined) {
            _(data).forEach(function (el) {
                user.action(el);
            });
        }
    });
});