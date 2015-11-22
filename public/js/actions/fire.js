var util = require('util');
var _ = require('lodash');

var Action = require('./action');

var Fire = function Fire(options) {
    Fire.super_.apply(this, arguments);

    this.cooldown = 100;
    this.ship = options.body;
    this.weapons = options.weapons;
};

util.inherits(Fire, Action);

Fire.prototype.getInfo = function() {
    return _.map(this.weapons, function(el) {
        return Math.floor(el.getAngle() * 100) / 100;
    });
};

module.exports = Fire;
