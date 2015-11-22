import util from 'util';

import Action from './Action';

var typeToMoveName = ['thrust', 'reverse', 'left', 'right', null, 'strafeLeft', 'strafeRight', 'angularBrake'];

export default function Move(options) {
    Move.super_.apply(this, arguments);

    this.ship = options.body;
    this.moveName = typeToMoveName[options.name - 1];
    this.type = options.name;
}

util.inherits(Move, Action);

Move.prototype._run = function(now) {
    this.ship.actionsUsed.push(this.type);
    this.ship[this.moveName](now);
};
