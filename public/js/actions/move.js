define(
    function(require) {
        var utils = require('utils');
        var Action = require('./action');

        var Move = function Move(options) {
            Move.super_.apply(this, arguments);

            this.durationAnimation = this.cooldown * 2;

            this.ship = options.body;
            this.moveName = options.name;
        };

        utils.inherits(Move, Action);

        Move.prototype._run = function() {
            this.ship[this.moveName]();
        };


        return Move;
    }
);