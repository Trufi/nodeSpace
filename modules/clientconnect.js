var _ = require('lodash');
var cookie = require('cookie');
var io = require('./socket').io();
var log = require('modules/log')(module);
var config = require('config');
var Game = require('game/game');
var User = require('game/user');
var body = require('game/body/index');

var cookieParser = require('cookie-parser')(config.session.secret);

io.sockets.on('connection', function (socket) {
    log.info('User connection');
    var user;

    var sid;

    // код синхронный
    cookieParser(socket.handshake, null, function(err) {
        sid = socket.handshake.signedCookies[config.session.key];
    });

    log.silly('User\'s sid = ' + sid);

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