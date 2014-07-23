var p2 = require('p2');
var shapes = require('./shapes');
var utils = require('./utils');

// Класс простейшего тела
function Body(param) {
    this.id = utils.getId('body');
    this.type = 0; // тип тела 0 - астероид
//    this.shape = shapes.asteroid;

    this.body = new p2.Body({
        mass: 1000,
        position: [0, 0],
        velocity: [0, 0],
        damping: 0,
        angularVelocity: 0,
        angularDamping: 0
    });
    this.body.addShape(new p2.Circle(87.5));

    if (typeof param !== 'undefined') {
        if (typeof param.position !== 'undefined') {
            this.body.position = param.position;
        }
        if (typeof param.velocity !== 'undefined') {
            this.body.velocity = param.velocity;
        }
        if (typeof param.angularVelocity !== 'undefined') {
            this.body.angularVelocity = param.angularVelocity;
        }
    }
}

Body.prototype.addToWorld = function(world) {
    world.addBody(this.body);
};

Body.prototype.getPosition = function() {
    return [this.body.position[0], this.body.position[1]];
};

Body.prototype.getVelocity = function() {
    return [this.body.velocity[0], this.body.velocity[1]];
};

Body.prototype.getAngularVelocity = function() {
    return this.body.angularVelocity;
};

Body.prototype.getAngle = function() {
    return this.body.angle;
};

Body.prototype.getMass = function() {
    return this.body.mass;
};

Body.prototype.getFirstInfo = function() {
    return {
        type: this.type,
        mass: this.body.mass,
        position: [
            this.body.position[0],
            this.body.position[1]
        ],
        velocity: [
            this.body.velocity[0],
            this.body.velocity[1]
        ],
        angularVelocity: this.body.angularVelocity,
        angle: this.body.angle,
        id: this.id
    };

};

Body.prototype.getInfo = function() {
    return {
        position: [
            this.body.position[0],
            this.body.position[1]
        ],
        velocity: [
            this.body.velocity[0],
            this.body.velocity[1]
        ],
        angularVelocity: this.body.angularVelocity,
        angle: this.body.angle,
        id: this.id
    };
};

module.exports = Body;