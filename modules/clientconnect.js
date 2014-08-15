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
        db.users.findOne({login: session.login}, function(err, doc) {
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
                socket.handshake.sid = sid;
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
            var user = users.player.create({socket: socket, db: userDoc});
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

    async.parallel([
        function(callback) {
            getUser(socket, callback)
        },
        function(callback) {
            var timeout = setTimeout(function() {
                log.silly('users load timeout');
                callback(new Error('users load timeout'));
            }, config.waitingUsersLoad);

            socket.once('clientOnLoad', function() {
                clearTimeout(timeout);
                callback(null, null);
            });
        }
    ],  function(err, results) {
        if (err) return err;

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
        var user = socket.handshake.user;

        if (user !== undefined) {
            _(data).forEach(function (el) {
                user.action(el);
            });
        }
    });

    socket.on('quickStart', function() {
        var user;

        if (socket.handshake.sid === undefined) {
            return log.warn('quickstart socket.handshake.sid  = undefined');
        }

        // находим Nobody юзера и переделываем его в Player
        user = users.findNobodyWithSid(socket.handshake.sid);

        if (user === undefined) {
            log.error('users with sid %s not found', socket.handshake.sid);
            return next(new Error('users not found'));
        }

        user = users.changeToPlayer(user, {name: config.users.anonName + users.count()});

        if (user === undefined) {
            log.error('user not update to player, sid %s', socket.handshake.sid);
            return next(new Error('user not update to player'));
        }
        log.info('user quickstart, username: %s', user.name);
        user.save();
    });
});

exports.loadSession = loadSession;