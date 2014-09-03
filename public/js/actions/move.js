define(
    function(require) {
        var utils = require('utils');
        var Action = require('./action');

        var typeToMoveName = ['thrust', 'reverse', 'left', 'right', null, 'strafeLeft', 'strafeRight', 'angularBrake'];

        var Move = function Move(options) {
            Move.super_.apply(this, arguments);

            //this.durationAnimation = this.cooldown * 2;

            this.ship = options.body;
            this.moveName = typeToMoveName[options.name - 1];
        };

        utils.inherits(Move, Action);

        return Move;
    }
);