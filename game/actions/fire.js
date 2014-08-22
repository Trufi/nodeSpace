var utils = require('util');
var Action = require('./action');

var Fire = function Fire(options) {
    Fire.super_.apply(this, arguments);

    this.cooldown = 50;
    this.ship = options.body;
};

utils.inherits(Fire, Action);

Fire.prototype._run = function() {
    this.ship.actionsUsed.push('fire');
    this.ship.fire();
};

module.exports = Fire;