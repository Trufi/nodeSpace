var p2 = require('p2');
var shapes = require('./shapes');

// Класс простейшего тела
var Body = function Body(options) {
    this.id = ++Body._idCounter;
    this.type = options.type;
    this.body;
    this.texture;
}

Body._idCounter = 0;

Body.prototype.createBody = function(options) {
    this.body = new p2.Body({
        mass: options.mass || 1000,
        position: options.position || [0, 0],
        velocity: options.velocity || [0, 0],
        damping: 0,
        angularVelocity: options.angularVelocity || 0,
        angularDamping: 0
    });
};

Body.prototype.applyShape = function() {
    this.body.addShape(new p2.Circle(87.5));
};

Body.prototype.addToWorld = function(world) {
    world.addBody(this.body);
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
        id: this.id,
        type: this.type
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