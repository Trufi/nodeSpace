var _ = require('lodash');
var body = require('../index');
var log = require('../../../modules/log')(module);

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
    this.lastTimeFire = 0;
    this.bulletVelocity = 700;
};

Weapon.prototype.checkAngle = function(now, angle) {
    var mbAngle = (this.angularVelocity + 1) * (now - this.lastTimeFire) / 1000,
        dAngle = Math.abs(resetAngle(angle - this.lastAngle));

    if (dAngle <= mbAngle) {
        return true;
    } else {
        log.warn('dAngle > mbAngle, %s > %s, bodyName: %s, bodyId: %s', dAngle, mbAngle, this.parent.name, this.parent.id);
        return false;
    }
};

Weapon.prototype.fire = function(now, angle) {
    var worldPoint = [];

    if (this.checkAngle(now, angle)) {
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

        this.lastTimeFire = now;
        this.lastAngle = angle;
    }
};

weapons.create = function(options) {
    options = options || {};
    options.id = idCounter++;

    return new Weapon(options);
};

module.exports = weapons;
