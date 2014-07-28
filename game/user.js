var body = require('./body/index');

var User = function User(socket) {
    this.id = ++User._idCounter;
    this.socket = socket;
    this.ship;
};

User._idCounter = 0;

User.prototype.getInfo = function() {
    var info = {};
    info.id = this.id;
    return info;
};

User.prototype.getFirstInfo = function() {
    var info = {};
    info.id = this.id;
    info.shipId = this.ship.id;
    return info;
};

User.prototype.send = function(name, data) {
    this.socket.emit(name, data);
    //console.log('To user ' + this.id + ' send "' + name + '"');
};

User.prototype.createShip = function() {
    this.ship = body.create({
        type: 10,
        position: [-100, -100],
        mass: 50
    });
};

module.exports = User;