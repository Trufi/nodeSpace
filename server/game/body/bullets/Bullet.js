import p2 from 'p2';

import Body from '../Body';
import mask from '../mask';
import time from '../../../modules/time';

export default class Bullet extends Body {
    constructor(options) {
        super(options);

        this.parent = options.parent;
        this.timeLive = 5000;
        this.damageValue = 5;
        this.timeCreate = null;
    }

    createBody(options) {
        this.body = new p2.Body({
            mass: 0.01,
            position: options.position || [0, 0],
            velocity: options.velocity || [0, 0],
            damping: 0,
            angularVelocity: 0,
            angularDamping: 0,
            angle: 0
        });

        this.timeCreate = time();

        this.body._gameBody = this;
    }

    applyShape() {
        this.shape = new p2.Circle({radius: 1});
        this.shape.collisionGroup = mask.BULLET;
        this.shape.collisionMask = mask.BODY | mask.SHIP;
        this.shape.sensor = true;
        this.body.addShape(this.shape);
    }

    update(now) {
        if (now - this.timeCreate > this.timeLive) {
            this.destroy();
        }
    }

    addDamage() {
        return this.damageValue;
    }

    checkForDestroyAfterCollide() {
        this.destroy();
    }

    getFirstInfo() {
        return {
            id: this.id,
            type: this.type,
            position: [Math.floor(this.body.position[0] * 100) / 100, Math.floor(this.body.position[1] * 100) / 100],
            velocity: [Math.floor(this.body.velocity[0] * 100) / 100, Math.floor(this.body.velocity[1] * 100) / 100]
        };
    }

    getInfo() {
        return null;
    }
}
