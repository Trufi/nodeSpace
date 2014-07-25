var p2 = require('p2');
var utils = require('util');
var shapes = require('./shapes');
var Body = require('./body');

var Asteroid = function Asteroid(options) {
    Asteroid.super_.apply(this, arguments);
};

utils.inherits(Asteroid, Body);

Asteroid.prototype.applyShape = function() {
    this.body.addShape(new p2.Circle(87.5));
};

module.exports = Asteroid;