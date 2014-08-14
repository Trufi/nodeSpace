var _ = require('lodash');
var Nobody = require('./nobody');
var Player = require('./player');
var log = require('modules/log')(module);
var config = require('config');
var db = require('modules/db');

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

users.changeToPlayer = function(user, options) {
    var newUser;

    if (user instanceof Nobody) {
        options = options || {};
        options.id = user.id;
        options.socket = user.socket;

        delete users.nobody.list[user.id];
        newUser = new Player(options);
        users.player.list[newUser.id] = newUser;
        newUser.send('changeStatusToPlayer', newUser.id);
        log.silly('send changeStatusToPlayer, name: %s', newUser.name);
    }

    return newUser;
};

users._count = 0;
users.count = function() {
    return ++this._count;
};
db.once('ready', function() {
    db.users.count(function(err, count) {
        if (err) {
            return log.error(err);
        }
        users._count = count;
    });
});

users.createNewInDatabase = function(options, callback) {
    options.name = config.users.anonName + users.count;

    db.users.insert(options, function(err) {
        if (err) return callback(err);
        log.info('Create new user in database, opt: ' + options);
        callback(null, null);
    });
};

module.exports = users;