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
        this.reflectAngle = 0.8;
        this.timeCreate;
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

    addDamage() {/*
     let v2 = [this.body.velocity[0], this.body.velocity[1]],
     v1 = [v2[0] - this.body.vlambda[0], v2[1] - this.body.vlambda[1]],
     a = Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.sqrt((v1[0] * v1[0] + v1[1] * v1[1]) * (v2[0] * v2[0] + v2[1] * v2[1])))),
     damage = 0;

     if (a > this.reflectAngle) {
     this.destroy();
     damage = this.damageValue;
     }*/

        return this.damageValue;
    }

    checkForDestroyAfterCollide() {/*
     let v2 = [this.body.velocity[0], this.body.velocity[1]],
     v1 = [v2[0] - this.body.vlambda[0], v2[1] - this.body.vlambda[1]],
     a = Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.sqrt((v1[0] * v1[0] + v1[1] * v1[1]) * (v2[0] * v2[0] + v2[1] * v2[1])))),
     damage = 0;

     if (a > this.reflectAngle) {
     this.destroy();
     damage = this.damageValue;
     }*/
        this.destroy();
    }

    getFirstInfo() {
        let info = [];
        info[0] = this.id;
        info[1] = this.type;
        info[2] = [Math.floor(this.body.position[0] * 100) / 100, Math.floor(this.body.position[1] * 100) / 100];
        info[3] = [Math.floor(this.body.velocity[0] * 100) / 100, Math.floor(this.body.velocity[1] * 100) / 100];
        return info;
    }

    getInfo() {
        return null;
    }
}
