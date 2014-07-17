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

User.prototype.getFirstInfo = function() {
    var info = {};
    info.id = this.id;
    return info;
};

User.prototype.send = function(name, data) {
    this.socket.emit(name, data);
    //console.log('To user ' + this.id + ' send "' + name + '"');
};

module.exports = User;