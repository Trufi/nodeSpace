import _ from 'lodash';
import p2 from 'p2';

import * as actions from '../actions';

// Класс простейшего тела
export default class Body {
    constructor(options) {
        this.id = options.id;
        this.type = options.type;
        this.body;
        this.texture;
        this.game;
        this.name = options.name;
        this.hp = 0;

        this.actions = {};
        // список доступных действий этого тела
        this.actionsArray = [];
        // список использованный действий в шаге игры
        this.actionsUsed = [];
    }

    createBody(options) {
        this.body = new p2.Body({
            mass: options.mass || 1000,
            position: options.position || [0, 0],
            velocity: options.velocity || [0, 0],
            damping: 0,
            angularVelocity: options.angularVelocity || 0,
            angularDamping: 0,
            angle: options.angle || 0
        });

        this.body._gameBody = this;
    }

    applyShape() {
        this.body.addShape(new p2.Circle({radius: 87.5}));
    }

    applyActions() {
        this.actionsArray.forEach(el => {
            this.actions[el] = actions.create({body: this, name: el});
        });
    }

    getFirstInfo() {
        return {
            id: this.id,
            type: this.type,
            position: this.body.position,
            velocity: this.body.velocity,
            angularVelocity: this.body.angularVelocity,
            angle: this.body.angle,
            actionsUsed: this.actionsUsed,
            hp: this.hp,
            mass: this.body.mass,
            name: this.name
        };
    }

    getInfo() {
        return {
            id: this.id,
            type: 0,
            position: this.body.position,
            velocity: this.body.velocity,
            angularVelocity: this.body.angularVelocity,
            angle: this.body.angle,
            actionsUsed: this.actionsUsed,
            hp: this.hp
        };
    }

    resetActionsUsed() {
        this.actionsUsed = [];
    }

    update() {
    }

    destroy() {
        if (this.game !== undefined) {
            this.game.removeBody(this);
        }
        this.body._gameBody = undefined;
        this.body.removeShape();
    }

    damage(bodyB) {
        bodyB.checkForDestroyAfterCollide();
    }

    addDamage() {
        return 0;
    }

    checkForDestroyAfterCollide() {
    }
}
