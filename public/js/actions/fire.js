define(
    function(require) {
        var utils = require('utils');
        var Action = require('./action');

        var Fire = function Fire(options) {
            Fire.super_.apply(this, arguments);

            this.cooldown = 50;
            this.ship = options.body;
            this.weapons = options.weapons;
        };

        utils.inherits(Fire, Action);

        Fire.prototype.getInfo = function() {
            return _.map(this.weapons, function(el) {
                return Math.floor(el.getAngle() * 100) / 100;
            });
        };

        return Fire;
    }
);