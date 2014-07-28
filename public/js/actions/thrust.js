define(
    function(require) {
        var utils = require('utils');
        var Action = require('./action');

        var Thrust = function Thrust(options) {
            Thrust.super_.apply(this, arguments);
        };

        utils.inherits(Thrust, Action);

        Thrust.prototype._run = function() {
            this.user.ship.thrust();
        };


        return Thrust;
    }
);