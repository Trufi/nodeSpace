var _ = require('lodash');
var utils = require('util');
var Action = require('./action');

var Fire = function Fire(options) {
    Fire.super_.apply(this, arguments);

    this.type = 5;
    this.cooldown = 100;
    this.ship = options.body;
    this.weapons = options.weapons;
};

utils.inherits(Fire, Action);

Fire.prototype._run = function(now, options) {
    var _this = this;

    this.ship.actionsUsed.push(this.type);

    _(options).forEach(function(angle, i) {
        if (_this.weapons[i] !== undefined) {
            _this.weapons[i].fire(now, angle);
        }
    });
};

module.exports = Fire;