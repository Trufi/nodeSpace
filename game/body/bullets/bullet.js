var p2 = require('p2');
var utils = require('util');
var Body = require('../body');
var mask = require('../mask');

var Bullet = function Bullet(options) {
    Bullet.super_.apply(this, arguments);

    this.timeLive = 5000;
    this.addDamage = 500;
    this.timeCreate;
};

utils.inherits(Bullet, Body);

Bullet.prototype.createBody = function(options) {
    this.body = new p2.Body({
        mass: 0.01,
        position: options.position || [0, 0],
        velocity: options.velocity || [0, 0],
        damping: 0,
        angularVelocity: 0,
        angularDamping: 0,
        angle: 0
    });

    this.timeCreate = Date.now();

    this.body._gameBody = this;
};

Bullet.prototype.applyShape = function() {
    this.shape = new p2.Circle(1);
    this.shape.collisionGroup = mask.BULLET;
    this.shape.collisionMask = mask.BODY | mask.SHIP;
    this.body.addShape(this.shape);
};

Bullet.prototype.update = function(now) {
    if (now - this.timeCreate > this.timeLive) {
        this.destroy();
    }
};

module.exports = Bullet;