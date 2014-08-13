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

users.findNobodyWithSid = function(sid) {
    return _.find(users.nobody.list, function(el) {
        var id = el.socket.handshake.sid;
        if (id !== undefined) {
            return id === sid;
        } else {
            return false;
        }
    });
};

users.changeToPlayer = function(user) {
    var newUser;

    if (user instanceof Nobody) {
        delete users.nobody.list[user.id];
        newUser = new Player({socket: user.socket, id: user.id});
        users.player.list[newUser.id] = newUser;
        newUser.send('changeStatus', newUser.getFirstInfo());
    }
};

module.exports = users;