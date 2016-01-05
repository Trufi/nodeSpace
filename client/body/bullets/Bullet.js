import PIXI from 'pixi.js';
import p2 from 'p2';

import assets from '../../modules/assets';
import camera from '../../modules/camera';
import Body from '../Body';
import mask from '../mask';

export default class Bullet extends Body {
    constructor(options) {
        super(options);

        this._updatedFromServer = false;
    }

    createBody(options) {
        this.body = new p2.Body({
            mass: 1,
            position: options.position || [0, 0],
            velocity: options.velocity || [0, 0],
            damping: 0,
            angularVelocity: 0,
            angularDamping: 0,
            angle: 0
        });

        this.body._gameBody = this;
    }

    applyShape() {
        this.shape = new p2.Circle({radius: 1});
        this.shape.collisionGroup = mask.BULLET;
        this.shape.collisionMask = mask.BODY | mask.SHIP;
        this.shape.sensor = true;
        this.body.addShape(this.shape);
    }

    createSprite() {
        this.sprite = new PIXI.Sprite(assets.texture.bulletGreen);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.rotation = Math.atan2(this.body.velocity[1], this.body.velocity[0]);
    }

    update(data) {
        this.body.position[0] = data.position[0];
        this.body.position[1] = data.position[1];
        this.body.velocity[0] = data.velocity[0];
        this.body.velocity[1] = data.velocity[1];
    }

    updateSprite() {
        this.sprite.position.x = camera.x(this.body.position[0]);
        this.sprite.position.y = camera.y(this.body.position[1]);
        this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());
    }

    updateActions() {
    }
}
