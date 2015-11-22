var util = require('util');
var Action = require('./action');

var typeToMoveName = ['thrust', 'reverse', 'left', 'right', null, 'strafeLeft', 'strafeRight', 'angularBrake'];

var Move = function Move(options) {
    Move.super_.apply(this, arguments);

    this.ship = options.body;
    this.moveName = typeToMoveName[options.name - 1];
};

util.inherits(Move, Action);

module.exports = Move;
