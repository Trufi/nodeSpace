import * as body from '../index';

import log from '../../../modules/log';

let idCounter = 1;

function resetAngle(angle) {
    const sign = angle > 0 ? 1 : -1;
    return sign * ((Math.abs(angle) + Math.PI) % (Math.PI * 2) - Math.PI);
}

class Weapon {
    constructor(options) {
        this.parent = options.parent;
        this.position = options.position || [0, 0];
        this.angularVelocity = 5;
        this.lastAngle = 0;
        this.lastTimeFire = 0;
        this.bulletVelocity = 700;
    }

    checkAngle(now, angle) {
        const mbAngle = (this.angularVelocity + 1) * (now - this.lastTimeFire) / 1000;
        const dAngle = Math.abs(resetAngle(angle - this.lastAngle));

        if (dAngle <= mbAngle) {
            return true;
        } else {
            log.warn(
                `dAngle > mbAngle, ${dAngle} > ${mbAngle}, bodyName: ${this.parent.name}, bodyId: ${this.parent.id}`
            );
            return false;
        }
    }

    fire(now, angle) {
        const worldPoint = [];

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
    }
}

export function create(options = {}) {
    options.id = idCounter++;

    return new Weapon(options);
}
