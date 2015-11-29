import p2 from 'p2';

import * as actions from '../../actions/index';
import * as weapons from '../weapons/index';
import Bullet from '../bullets/Bullet';
import Body from '../Body';
import mask from '../mask';

export default class Ship extends Body {
    constructor(options) {
        super(options);

        this.forceThrust = options.forceThrust || 1500;
        this.forceSide = options.forceSide || 400;
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
        this.shape = new p2.Box({width: 60, height: 40});
        this.shape.collisionGroup = mask.SHIP;
        this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
        this.body.addShape(this.shape);

        this.applyWeapons();
    }

    // газ
    thrust() {
        this.body.applyImpulseLocal([this.forceThrust, 0], [-20, 0]);
    }

    reverse() {
        this.body.applyImpulseLocal([-this.forceSide, 0], [20, 0]);
    }

    left() {
        // первый двигатель
        this.body.applyImpulseLocal([0, this.forceSide], [-10, 10]);
        // второй двигатель
        this.body.applyImpulseLocal([0, -this.forceSide], [10, -10]);
    }

    right() {
        // первый двигатель
        this.body.applyImpulseLocal([0, this.forceSide], [10, 10]);
        // второй двигатель
        this.body.applyImpulseLocal([0, -this.forceSide], [-10, -10]);
    }

    strafeLeft() {
        // первый двигатель
        this.body.applyImpulseLocal([0, -this.forceSide], [10, 10]);
        // второй двигатель
        this.body.applyImpulseLocal([0, -this.forceSide], [-10, 10]);
    }

    strafeRight() {
        // первый двигатель
        this.body.applyImpulseLocal([0, this.forceSide], [10, -10]);
        // второй двигатель
        this.body.applyImpulseLocal([0, this.forceSide], [-10, -10]);
    }

    angularBrake(now) {
        const eps = 0.15;

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
