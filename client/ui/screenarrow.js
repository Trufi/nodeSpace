import PIXI from 'pixi.js';
import _ from 'lodash';

import render from '../modules/render';
import assets from '../modules/assets';

export default class Arrow {
    constructor(options) {
        this.padding = 30;
        this.sprite;
        this.text;
        this.camera;
        //this.stage = options.stage;

        this.setCamera(options.camera);

        this.target = [0, 0];
        this.getTargetPosition = this.getPointPosition;
        this.followTo(options.target);

        this.createSprite();
        //this.createText();
    }

    followTo(arg) {
        if (_.isArray(arg)) {
            this.target = arg;
            this.getTargetPosition = this.getPointPosition;
        } else if (arg.body !== undefined) {
            this.target = arg;
            this.getTargetPosition = this.getBodyPosition;
        } else if (typeof arg === 'function') {
            this.target = undefined;
            this.getTargetPosition = arg;
        }
    };

    getPointPosition() {
        return [this.target[0], this.target[1]];
    };

    getBodyPosition() {
        return [this.target.body.position[0], this.target.body.position[1]];
    };

    createSprite() {
        this.sprite = new PIXI.Sprite(assets.texture.screenArrow);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        render.layers[4].addChild(this.sprite);
    };

    createText() {
        this.text = new PIXI.Text('0', {
            fill: '#AD0F0F'
        });

        render.layers[4].addChild(this.text);
    };

    setCamera(camera) {
        this.camera = camera;
        this.cameraCornerAngle = [];
        this.cameraCornerAngle[1] = Math.atan2(this.camera.height, this.camera.width);
        this.cameraCornerAngle[0] = Math.atan2(this.camera.height, -this.camera.width);
        this.cameraCornerAngle[2] = -this.cameraCornerAngle[0];
        this.cameraCornerAngle[3] = -this.cameraCornerAngle[1];
    };

    getSpritePosition() {
        const targetPos = this.getTargetPosition();
        const cameraPos = this.camera.position;
        const angle = - Math.atan2(targetPos[1] - cameraPos[1], targetPos[0] - cameraPos[0]);
        let spritePos = [];

        if (angle > this.cameraCornerAngle[3] && angle <= this.cameraCornerAngle[1]) {
            spritePos[0] = this.camera.width - this.padding;
            spritePos[1] = this.camera.height / 2 - (this.camera.width / 2 - this.padding) * Math.tan(angle);
        } else if (angle > this.cameraCornerAngle[1] && angle <= this.cameraCornerAngle[0]) {
            spritePos[1] = this.padding;
            spritePos[0] = this.camera.width / 2 + (this.camera.height / 2 - this.padding) / Math.tan(angle);
        } else if ((angle > this.cameraCornerAngle[0] && angle <= Math.PI) || (angle <= this.cameraCornerAngle[2] && angle > -Math.PI)) {
            spritePos[0] = this.padding;
            spritePos[1] = this.camera.height / 2 + (this.camera.width / 2 - this.padding) * Math.tan(angle);
        } else if (angle > this.cameraCornerAngle[2] && angle <= this.cameraCornerAngle[3]) {
            spritePos[1] = this.camera.height - this.padding;
            spritePos[0] = this.camera.width / 2 - (this.camera.height / 2 - this.padding) / Math.tan(angle);
        }

        return {
            position: spritePos,
            angle: -angle
        };
    };

    update() {
        if (this.camera.containsSprite(this.target.sprite)) {
            this.sprite.visible = false;
        } else {
            let spr = this.getSpritePosition();
            this.sprite.position.x = spr.position[0];
            this.sprite.position.y = spr.position[1];
            this.sprite.rotation = spr.angle;
            this.sprite.visible = true;
        }
    }
}
