var p2 = require('p2');
var utils = require('util');
var shapes = require('./shapes');
var Body = require('./body');
var mask = require('./mask');

var Asteroid = function Asteroid(options) {
    Asteroid.super_.apply(this, arguments);
};

utils.inherits(Asteroid, Body);

Asteroid.prototype.applyShape = function() {
    this.shape = new p2.Circle(87.5);
    this.shape.collisionGroup = mask.BODY;
    this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
    this.body.addShape(this.shape);
};

module.exports = Asteroid;