import PIXI from 'pixi.js';
import p2 from 'p2';

import assets from '../../modules/assets';
import Body from '../Body';

export default class Rectangle extends Body {
    constructor(options) {
        super(options);
    }

    applyShape() {
        this.body.addShape(new p2.Rectangle(100, 100));
    }

    createSprite() {
        this.sprite = new PIXI.Sprite(assets.texture.rectangle);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    }
}
