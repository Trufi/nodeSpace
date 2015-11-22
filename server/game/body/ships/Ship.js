import _ from 'lodash';
import p2 from 'p2';

import * as actions from '../../actions';
import * as weapons from '../weapons';
import Bullet from '../bullets/Bullet';
import Body from '../Body';
import mask from '../mask';

export default class Ship extends Body {
    constructor(options) {
        super(options);

        this.forceThrust = options.forceThrust || 50000;
        this.forceSide = options.forceSide || 15000;
        this.client;
        this.hp = 100;

        this.weapons = [];
    }

    applyActions() {
        [1, 2, 3, 4, 6, 7, 8].forEach(el => {
            this.actions[el] = actions.create({body: this, name: el});
        });

        // добавляем действие для конкретного оружия
        this.actions[5] = actions.create({body: this, name: 5, weapons: this.weapons});
    }

    applyWeapons() {
        this.weapons[0] = weapons.create({
            position: [-10, 0],
            parent: this
        });

        this.weapons[1] = weapons.create({
            position: [10, 0],
            parent: this
        });
    }

    applyShape() {
        this.shape = new p2.Rectangle(60, 40);
        this.shape.collisionGroup = mask.SHIP;
        this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
        this.body.addShape(this.shape);

        this.applyWeapons();
    }

    // газ
    thrust() {
        let worldPoint = [];
        let force = [this.forceThrust * Math.cos(this.body.angle), this.forceThrust * Math.sin(this.body.angle)];

        this.body.toWorldFrame(worldPoint, [-20, 0]);
        this.body.applyForce(force, worldPoint);
    }

    reverse() {
        let worldPoint = [];
        let force = [-this.forceSide * Math.cos(this.body.angle), -this.forceSide * Math.sin(this.body.angle)];

        this.body.toWorldFrame(worldPoint, [20, 0]);
        this.body.applyForce(force, worldPoint);
    };

    left() {
        let worldPoint = [];
        let force;

        // первый двигатель
        this.body.toWorldFrame(worldPoint, [-10, 10]);
        force = [-this.forceSide * Math.sin(this.body.angle), this.forceSide * Math.cos(this.body.angle)];
        this.body.applyForce(force, worldPoint);
        // второй двигатель
        this.body.toWorldFrame(worldPoint, [10, -10]);
        force = [this.forceSide * Math.sin(this.body.angle), -this.forceSide * Math.cos(this.body.angle)];
        this.body.applyForce(force, worldPoint);
    }

    right() {
        let worldPoint = [];
        let force;

        // первый двигатель
        this.body.toWorldFrame(worldPoint, [10, 10]);
        force = [-this.forceSide * Math.sin(this.body.angle), this.forceSide * Math.cos(this.body.angle)];
        this.body.applyForce(force, worldPoint);
        // второй двигатель
        this.body.toWorldFrame(worldPoint, [-10, -10]);
        force = [this.forceSide * Math.sin(this.body.angle), -this.forceSide * Math.cos(this.body.angle)];
        this.body.applyForce(force, worldPoint);
    }

    strafeLeft() {
        let worldPoint = [];
        let force;

        // первый двигатель
        this.body.toWorldFrame(worldPoint, [10, 10]);
        force = [this.forceSide * Math.sin(this.body.angle), -this.forceSide * Math.cos(this.body.angle)];
        this.body.applyForce(force, worldPoint);
        // второй двигатель
        this.body.toWorldFrame(worldPoint, [-10, 10]);
        this.body.applyForce(force, worldPoint);
    }

    strafeRight() {
        let worldPoint = [];
        let force;

        // первый двигатель
        this.body.toWorldFrame(worldPoint, [10, -10]);
        force = [-this.forceSide * Math.sin(this.body.angle), this.forceSide * Math.cos(this.body.angle)];
        this.body.applyForce(force, worldPoint);
        // второй двигатель
        this.body.toWorldFrame(worldPoint, [-10, -10]);
        this.body.applyForce(force, worldPoint);
    }

    angularBrake(now) {
        let eps = 0.15;

        if (Math.abs(this.body.angularVelocity) < eps) {
            this.body.angularVelocity = 0;
        } else if (this.body.angularVelocity > 0) {
            this.client.action(now, 3);
        } else {
            this.client.action(now, 4);
        }
    }

    damage(bodyB) {
        let damageValue;

        if (bodyB instanceof Bullet) {
            if (bodyB.parent.id !== this.id) {
                damageValue = bodyB.addDamage();
                bodyB.checkForDestroyAfterCollide();
            } else {
                damageValue = 0;
            }
        } else {
            damageValue = bodyB.addDamage() + Math.sqrt(this.body.vlambda[0] * this.body.vlambda[0] +
                    this.body.vlambda[1] * this.body.vlambda[1]) * this.body.mass / 500;

            bodyB.checkForDestroyAfterCollide();
        }


        this.hp = this.hp - damageValue;
    }
}
