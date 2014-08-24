var p2 = require('p2');
var utils = require('util');
var shapes = require('./shapes');
var Body = require('./body');
var mask = require('./mask');

var Asteroid = function Asteroid(options) {
    Asteroid.super_.apply(this, arguments);

    this.name = 'Asteroid';
};

utils.inherits(Asteroid, Body);

Asteroid.prototype.createBody = function(options) {
    this.body = new p2.Body({
        mass: Math.pow(10, 3),
        position: options.position || [0, 0],
        velocity: options.velocity || [0, 0],
        damping: 0,
        angularVelocity: options.angularVelocity || 0,
        angularDamping: 0,
        angle: options.angle || 0
    });

    this.body._gameBody = this;
};

Asteroid.prototype.applyShape = function() {
    this.shape = new p2.Circle(87.5);
    this.shape.collisionGroup = mask.BODY;
    this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
    this.body.addShape(this.shape);
};

module.exports = Asteroid;