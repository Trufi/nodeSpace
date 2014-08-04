var _ = require('lodash');
var body = require('./body/index');
var config = require('./config.json');
var action = require('./actions/index');

var User = function User(socket) {
    this.id = ++User._idCounter;
    this.socket = socket;
    this.ship;

    this.actions = {};

    // info.type - 0 - spectator, 1 - player
    this.type = 0;
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
    info.type = this.type;

    if (this.type !== 0) {
        info.shipId = this.ship.id;
    }

    return info;
};

User.prototype.send = function(name, data) {
    this.socket.emit(name, data);
    //console.log('To user ' + this.id + ' send "' + name + '"');
};

User.prototype.createShip = function() {
    var _this = this;

    this.ship = body.create({
        type: 10,
        position: [-100, -100],
        mass: 50
    });

    _(this.ship.actions).forEach(function(el, i) {
        _this.actions[i] = el;
    });
};

User.prototype.isSpectator = function() {
    return this.ship === undefined;
};

User.prototype.action = function(name) {
    if (this.actions[name] !== undefined) {
        this.actions[name].use();
    }
};

module.exports = User;