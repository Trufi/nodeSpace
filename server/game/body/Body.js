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
        this.body.addShape(new p2.Circle(87.5));
    }

    applyActions() {
        this.actionsArray.forEach(el => {
            this.actions[el] = actions.create({body: this, name: el});
        });
    }

    getFirstInfo() {
        let info = [];
        info[0] = this.id;
        info[1] = this.type;
        info[2] = [Math.floor(this.body.position[0] * 100) / 100, Math.floor(this.body.position[1] * 100) / 100];
        info[3] = [Math.floor(this.body.velocity[0] * 100) / 100, Math.floor(this.body.velocity[1] * 100) / 100];
        info[4] = Math.floor(this.body.angularVelocity * 100) / 100;
        info[5] = Math.floor(this.body.angle * 100) / 100;
        info[6] = this.actionsUsed;
        info[7] = Math.floor(this.hp * 100) / 100;
        info[8] = this.body.mass;

        if (this.name !== undefined) {
            info[9] = this.name;
        }

        return info;
    }

    getInfo() {
        let info = [];
        info[0] = this.id;

        // в firstInfo это this.type
        info[1] = 0;

        info[2] = [Math.floor(this.body.position[0] * 100) / 100, Math.floor(this.body.position[1] * 100) / 100];
        info[3] = [Math.floor(this.body.velocity[0] * 100) / 100, Math.floor(this.body.velocity[1] * 100) / 100];
        info[4] = Math.floor(this.body.angularVelocity * 100) / 100;
        info[5] = Math.floor(this.body.angle * 100) / 100;
        info[6] = this.actionsUsed;
        info[7] = Math.floor(this.hp * 100) / 100;
        return info;
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
