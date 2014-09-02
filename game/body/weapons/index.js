var _ = require('lodash');
var body = require('../index');

var weapons = {};
var idCounter = 1;

function resetAngle(angle) {
    var sign = angle > 0 ? 1 : -1;
    return sign * ((Math.abs(angle) + Math.PI) % (Math.PI * 2) - Math.PI);
}

var Weapon = function Weapon(options) {
    this.parent = options.parent;
    this.position = options.position || [0, 0];
    this.angularVelocity = 5;
    this.lastAngle = 0;
    this.bulletVelocity = 500;
};

Weapon.prototype.fire = function(angle) {
    var worldPoint = [];
    this.parent.body.toWorldFrame(worldPoint, this.position);

    this.parent.game.addBody(
        body.create({
            type: 1000,
            position: [worldPoint[0], worldPoint[1]],
            velocity: [
                    this.bulletVelocity * Math.cos(angle + this.parent.body.angle) + this.parent.body.velocity[0],
                    this.bulletVelocity * Math.sin(angle + this.parent.body.angle) + this.parent.body.velocity[1]
            ],
            parent: this.parent
        })
    );
};

weapons.create = function(options) {
    options = options || {};
    options.id = idCounter++;

    return new Weapon(options);
};

module.exports = weapons;