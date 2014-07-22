var p2 = require('p2');
var shapes = require('./shapes');
var utils = require('./utils');

// Класс простейшего тела
function Body() {
    this.id = utils.getId('body');
    this.type = 0; // тип тела 0 - астероид
//    this.shape = shapes.asteroid;

    this.body = new p2.Body({
        mass: 1000,
        position: [10, 10],
        velocity: [10, 0],
        damping: 0,
        angularVelocity: 0.2,
        angularDamping: 0
    });
}

Body.prototype.addToWorld = function(world) {
    world.addBody(this.body);
};

/*Body.prototype.update = function() {
    this.position = this.body.position;
    this.velocity = this.body.velocity;
    this.angularVelocity = this.body.angularVelocity;
};*/

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
        angle: this.body.angle
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
        angle: this.body.angle
    };
};

module.exports = Body;