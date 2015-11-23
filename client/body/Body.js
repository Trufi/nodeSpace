import PIXI from 'pixi.js';
import _ from 'lodash';
import p2 from 'p2';

import camera from '../../modules/camera';
import render from '../../modules/render';
import * as actions from '../../actions';

export default class Body {
    constructor(options) {
        this.id = options[0];
        this.type = options[1];
        this.body;
        this.sprite;
        this.spriteSize = 100;
        this.shape;
        this.game;
        this.name = options[9] || 'Unknown';
        this.hp = options[7];

        this.actions = {};
        // список доступных действий этого корабля
        this.actionsArray = [];
    }

    createBody(options) {
        this.body = new p2.Body({
            mass: options[8],
            position: options[2],
            velocity: options[3],
            damping: 0,
            angularVelocity: options[4],
            angularDamping: 0,
            angle: options[5]
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
        game.world.addBody(this.body);
        render.layers[2].addChild(this.sprite);
        this.game = game;
    }

    removeFromGame() {
        this.game.world.removeBody(this.body);
        render.layers[2].removeChild(this.sprite);
        this.game = undefined;
    }

    updateSprite() {
        this.sprite.position.x = camera.x(this.body.position[0]);
        this.sprite.position.y = camera.y(this.body.position[1]);
        this.sprite.rotation = this.body.angle;
        this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());
    }

    update(now, data) {
        this.body.position[0] = data[2][0];
        this.body.position[1] = data[2][1];
        this.body.velocity[0] = data[3][0];
        this.body.velocity[1] = data[3][1];
        this.body.angularVelocity = data[4];
        this.body.angle = data[5];
        this.hp = data[7];
    }

    updateActions(now, data) {
        _.forEach(data[6], el => {
            this.action(now, el);
        });
    }

    action(now, name) {
        if (this.actions[name] !== undefined) {
            this.actions[name].use(now);
        }
    }

    destroy() {
        if (this.game !== undefined) {
            this.game.removeBody(this);
        }
        this.body._gameBody = undefined;
    }
}
