import PIXI from 'pixi.js';
import p2 from 'p2';

import assets from '../../modules/assets';
import Body from '../Body';
import mask from '../mask';

export default class Asteroid extends Body {
    constructor(options) {
        super(options);
    }

    applyShape() {
        this.shape = new p2.Circle(87.5);
        this.shape.collisionGroup = mask.BODY;
        this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
        this.body.addShape(this.shape);
    }

    createSprite() {
        this.sprite = new PIXI.Sprite(assets.texture.asteroid);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    }
}
