var utils = require('util');
var p2 = require('p2');
var Body = require('../body');
var config = require('../../config.json');

var Ship = function Ship(options) {
    Ship.super_.apply(this, arguments);

    // запоминаем последнее использование, чтобы запретить абуз
    this.lastTimeAbilities = {
        thrust: 0
    };

    this.forceThrust = 100000;
};

utils.inherits(Ship, Body);

Ship.prototype.applyShape = function() {
    this.body.addShape(new p2.Rectangle(40, 60));
};

Ship.prototype.checkAbilities = function(name) {
    var now = Date.now();

    if (now - this.lastTimeAbilities[name] > config.timeAbilityRepeat) {
        this.lastTimeAbilities[name] = now;
        return true;
    } else {
        return false;
    }
};

// газ
Ship.prototype.thrust = function() {
    var worldPoint = [],
        force;

    if (this.checkAbilities('thrust')) {
        this.body.toWorldFrame(worldPoint, [0, -20]);
        force = [-this.forceThrust * Math.sin(this.body.angle), -this.forceThrust * Math.cos(this.body.angle)];
        this.body.applyForce(force, worldPoint);
    }
};

module.exports = Ship;
