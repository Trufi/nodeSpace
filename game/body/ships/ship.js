var utils = require('util');
var p2 = require('p2');
var Body = require('../body');
var config = require('../../config.json');

var Ship = function Ship(options) {
    Ship.super_.apply(this, arguments);

    this.forceThrust = 100000;
    this.userActions = ['thrust'];
};

utils.inherits(Ship, Body);

Ship.prototype.applyShape = function() {
    this.body.addShape(new p2.Rectangle(40, 60));
};

// газ
Ship.prototype.thrust = function() {
    var worldPoint = [],
        force = [this.forceThrust * Math.sin(this.body.angle), -this.forceThrust * Math.cos(this.body.angle)];

    this.body.toWorldFrame(worldPoint, [0, -20]);
    this.body.applyForce(force, worldPoint);
};

module.exports = Ship;
