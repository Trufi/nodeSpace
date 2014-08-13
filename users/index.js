var _ = require('lodash');
var Nobody = require('./nobody');
var Player = require('./player');

var users = {};

users._idCounter = 0;

users.nobody = {};
users.nobody.list = {};
users.nobody.create = function(options) {
    options.id = ++users._idCounter;

    var user = new Nobody(options);
    users.nobody.list[user.id] = user;

    return user;
};

users.player = {};
users.player.list = {};
users.player.create = function(options) {
    options.id = ++users._idCounter;

    var user = new Player(options);
    users.player.list[user.id] = user;

    return user;
};

users.findPlayerWithSid = function(sid) {
    return _.find(users.player.list, function(el) {
        return el.socket.handshake.session.id === sid;
    });
};

module.exports = users;