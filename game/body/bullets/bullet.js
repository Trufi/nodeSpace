var p2 = require('p2');
var utils = require('util');
var Body = require('../body');
var mask = require('../mask');

var Bullet = function Bullet(options) {
    Bullet.super_.apply(this, arguments);

    this.timeLive = 5000;
    this.addDamage = 500;
    this.reflectAngle = 0.8;
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

Bullet.prototype.damage = function() {
    var v2 = [this.body.velocity[0], this.body.velocity[1]],
        v1 = [v2[0] - this.body.vlambda[0], v2[1] - this.body.vlambda[1]],
        a = Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.sqrt((v1[0] * v1[0] + v1[1] * v1[1]) * (v2[0] * v2[0] + v2[1] * v2[1]))));

    if (a > this.reflectAngle) {
        this.destroy();
    }
};

Bullet.prototype.getFirstInfo = function() {
    var info = [];
    info[0] = this.id;
    info[1] = this.type;
    info[2] = [Math.floor(this.body.position[0] * 100) / 100, Math.floor(this.body.position[1] * 100) / 100];
    info[3] = [Math.floor(this.body.velocity[0] * 100) / 100, Math.floor(this.body.velocity[1] * 100) / 100];
    return info;
};

Bullet.prototype.getInfo = function() {};

module.exports = Bullet;