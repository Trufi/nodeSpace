var utils = require('util');
var p2 = require('p2');
var _ = require('lodash');
var Body = require('../body');
var config = require('config');

var Ship = function Ship(options) {
    Ship.super_.apply(this, arguments);

    this.forceThrust = options.forceThrust || 10000;
    this.forceSide = options.forceSide || 500;

    // список доступных действий этого корабля
    this.actionsArray = ['thrust', 'reverse', 'left', 'right'];
    // список использованный действий в шаге игры
    this.actionsUsed = [];
};

utils.inherits(Ship, Body);

Ship.prototype.applyShape = function() {
    this.body.addShape(new p2.Rectangle(60, 40));
};

// газ
Ship.prototype.thrust = function() {
    var worldPoint = [],
        force = [this.forceThrust * Math.cos(this.body.angle), this.forceThrust * Math.sin(this.body.angle)];

    this.body.toWorldFrame(worldPoint, [-20, 0]);
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.reverse = function() {
    var worldPoint = [],
        force = [-this.forceSide * Math.cos(this.body.angle), -this.forceSide * Math.sin(this.body.angle)];

    this.body.toWorldFrame(worldPoint, [20, 0]);
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.left = function() {
    var worldPoint = [],
        force;

    // первый двигатель
    this.body.toWorldFrame(worldPoint, [-10, 10]);
    force = [-this.forceThrust * Math.sin(this.body.angle), this.forceThrust * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
    // второй двигатель
    this.body.toWorldFrame(worldPoint, [10, -10]);
    force = [this.forceThrust * Math.sin(this.body.angle), -this.forceThrust * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.right = function() {
    var worldPoint = [],
        force;

    // первый двигатель
    this.body.toWorldFrame(worldPoint, [10, 10]);
    force = [-this.forceThrust * Math.sin(this.body.angle), this.forceThrust * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
    // второй двигатель
    this.body.toWorldFrame(worldPoint, [-10, -10]);
    force = [this.forceThrust * Math.sin(this.body.angle), -this.forceThrust * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
};



module.exports = Ship;
