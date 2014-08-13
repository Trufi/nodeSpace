var Nobody = require('./nobody');
var Player = require('./player');

var users = {};

users._idCounter = 0;

users.nobody = {};
users.nobody.create = function(options) {
    options.id = ++users._idCounter;
    return new Nobody(options);
};

users.player = {};
users.player.create = function(options) {
    options.id = ++users._idCounter;
    return new Player(options);
};

module.exports = users;