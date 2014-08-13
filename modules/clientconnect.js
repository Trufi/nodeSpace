var _ = require('lodash');
var io = require('./socket').io();
var log = require('modules/log')(module);
var async = require('async');
var config = require('config');
var users = require('users');
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
    } else if (session.login) {
        db.users.find({login: session.login}, function(err, doc) {
            if (err) {
                callback(err);
            }

            callback(null, doc);
        });
    } else {
        callback(new Error('session not have login'));
    }
}

function getUser(socket, callback) {
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
                socket.handshake.session = session;
                loadUserFromDB(session, callback);
            }
        },
        function(userDoc) {
            var user = users.player.create({socket: socket, doc: userDoc});
            log.silly('user taked from db as Player, username: ' + user.name);
            callback(null, user);
        }
    ], function(err) {
        var user;
        if (!err) {
            // не заходит
            log.silly('No error!');
        } else {
            log.silly(err.message);
            user = users.nobody.create({socket: socket});
            log.silly('new client create as Nobody');
            callback(null, user);
        }
    });
}

io.sockets.on('connection', function (socket) {
    log.info('User connection');
    var user;

    async.parallel([
        function(callback) {
            getUser(socket, callback)
        },
        function(callback) {
            socket.once('clientOnLoad', function() {
                callback(null, null);
            });
        }
    ],  function(err, results) {
        var user = results[0];

        user.sendFirstState();

        log.silly('send game first state to user');
    });

    // клиент загрузился
    /*socket.once('clientOnLoad', function() {
        //user = new User(socket);
        //user.createShip();
        //game.addUser(user);

        //game.addBody(user.ship);
        //user.send('firstGameState', game.getGameFirstState(user));

        //socket.emit('firstGameState', game.getGameFirstState());
    });*/

    socket.on('playerActions', function(data) {
        if (user !== undefined) {
            _(data).forEach(function (el) {
                user.action(el);
            });
        }
    });
});