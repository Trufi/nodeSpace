var utils = require('util');
var Action = require('./action');

var Move = function Move(options) {
    Move.super_.apply(this, arguments);

    this.ship = options.body;
    this.moveName = options.name;
};

utils.inherits(Move, Action);

Move.prototype._run = function() {
    this.ship[this.moveName]();
};

module.exports = Move;