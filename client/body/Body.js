import PIXI from 'pixi.js';
import _ from 'lodash';
import p2 from 'p2';

import Interpolation from '../modules/Interpolation';
import camera from '../modules/camera';
import render from '../modules/render';
import * as actions from '../actions';

export default class Body {
    constructor(options) {
        this.id = options.id;
        this.type = options.type;
        this.body = null;
        this.sprite = null;
        this.spriteSize = 100;
        this.shape = null;
        this.game = null;
        this.name = options.name || 'Unknown';
        this.hp = options.hp;

        this.actions = {};
        // список доступных действий этого корабля
        this.actionsArray = [];

        this._updatedFromServer = true;

        this._interpolation = null;
    }

    createBody(options) {
        this.body = new p2.Body({
            mass: options.mass,
            position: options.position,
            velocity: options.velocity,
            damping: 0,
            angularVelocity: options.angularVelocity,
            angularDamping: 0,
            angle: options.angle
        });

        this.body._gameBody = this;
    }

    applyShape() {
    }

    applyActions() {
        _.forEach(this.actionsArray, el => {
            this.actions[el] = actions.create({body: this, name: el});
        });
    }

    createSprite() {
    }

    addToGame(game) {
        if (!this._updatedFromServer) {
            game.world.addBody(this.body);
        }
        render.layers[2].addChild(this.sprite);
        this.game = game;
    }

    removeFromGame() {
        if (!this._updatedFromServer) {
            this.game.world.removeBody(this.body);
        }
        render.layers[2].removeChild(this.sprite);
        this.game = null;
    }

    updateSprite() {
        this.sprite.position.x = camera.x(this.body.position[0]);
        this.sprite.position.y = camera.y(this.body.position[1]);
        this.sprite.rotation = this.body.angle;
        this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());
    }

    update(now, data) {
        if (data.position !== undefined) {
            this.body.position[0] = data.position[0];
            this.body.position[1] = data.position[1];
        }

        if (data.velocity !== undefined) {
            this.body.velocity[0] = data.velocity[0];
            this.body.velocity[1] = data.velocity[1];
        }

        if (data.angularVelocity !== undefined) {
            this.body.angularVelocity = data.angularVelocity;
        }

        if (data.angle !== undefined) {
            this.body.angle = data.angle;
        }

        if (data.hp !== undefined) {
            this.hp = data.hp;
        }
    }

    updateImportant(now, data) {
        if (data.hp !== undefined) {
            this.hp = data.hp;
        }
    }

    setInterpolation({startTime, endTime, startData, endData}) {
        // Интерполируем только положение и угл поворота
        const startArray = [startData.position[0], startData.position[1], startData.angle];
        const endArray = [endData.position[0], endData.position[1], endData.angle];

        this._interpolation = new Interpolation({
            values: startArray,
            time: startTime
        }, {
            values: endArray,
            time: endTime
        });

        return this;
    }

    interpolate(time) {
        if (!this._interpolation) { return this; }

        const values = this._interpolation.step(time);

        if (!values) { return this; }

        this.body.position[0] = values[0];
        this.body.position[1] = values[1];
        this.body.angle = values[2];

        return this;
    }

    updateActions(now, data) {
        _.forEach(data.actionsUsed, el => {
            this.action(now, el);
        });
    }

    action(now, name) {
        if (this.actions[name] !== undefined) {
            this.actions[name].use(now);
        }
    }

    destroy() {
        if (this.game !== null) {
            this.game.removeBody(this);
        }
        this.body._gameBody = null;
    }
}
