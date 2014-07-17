var utils = require('./utils');

var User = function User(socket) {
    this.id = utils.getId('user');
    this.socket = socket;
};

User.prototype.getInfo = function() {
    var info = {};
    info.id = this.id;
    return info;
};

module.exports = User;