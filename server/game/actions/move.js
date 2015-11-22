var utils = require('util');
var Action = require('./action');

var typeToMoveName = ['thrust', 'reverse', 'left', 'right', null, 'strafeLeft', 'strafeRight', 'angularBrake'];

var Move = function Move(options) {
    Move.super_.apply(this, arguments);

    this.ship = options.body;
    this.moveName = typeToMoveName[options.name - 1];
    this.type = options.name;
};

utils.inherits(Move, Action);

Move.prototype._run = function(now) {
    this.ship.actionsUsed.push(this.type);
    this.ship[this.moveName](now);
};

module.exports = Move;
