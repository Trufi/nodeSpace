import PIXI from 'pixi.js';
import _ from 'lodash';

import render from '../modules/render';
import position from './position';

let frame = {};

class Frame {
    constructor(options = {}) {
        this.width = options.width || 0;
        this.height = options.height || 0;

        if (options.anchor !== undefined) {
            this.anchor = position[options.anchor];
        } else {
            this.anchor = position.TOPLEFT;
        }
        this.position = options.position || [0, 0];

        if (typeof options.onShow === 'function') {
            this.onShow = options.onShow;
        } else {
            this.onShow = function() {
            };
        }

        this.displayObject = new PIXI.DisplayObjectContainer();
        this.displayObject.width = this.width;
        this.displayObject.height = this.height;
        this.displayObject.position.x = this.anchor[0] + this.position[0];
        this.displayObject.position.y = this.anchor[1] + this.position[1];
        this.displayObject.defaultCursor = 'default';

        if (this.width > 0 && this.height > 0) {
            this.displayObject.buttonMode = true;
            this.displayObject.interactive = true;
            this.displayObject.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
        }

        this.visible = (options.visible !== undefined) ? options.visible : true;
        this.displayObject.visible = this.visible;

        this.displayObject.mousedown = this._mousedown;

        render.layers[4].addChild(this.displayObject);

        this.opacity = options.opacity || 0.5;

        this.childs = {};
        this._childsIdCounter = 0;

        this._initColor(options.color);
    }

    _initColor(color) {
        this.color = color;

        if (this.color === undefined) return;

        switch (this.color) {
            case 'blue':
                this.strokeColor = '1a59e8';
                break;
            case 'red':
                this.strokeColor = '980707';
                break;
            case 'orange':
                this.strokeColor = 'f66a1d';
                break;
            case 'green':
                this.strokeColor = '0a912d';
                break;
            default:
                this.strokeColor = '1a59e8';
        }


        this.spriteBackground = new PIXI.Graphics();
        this.spriteBackground.lineStyle(1, parseInt('0x' + this.strokeColor, 16), this.opacity);
        this.spriteBackground.beginFill(parseInt('0x' + this.strokeColor, 16), this.opacity - 0.4);
        this.spriteBackground.drawRect(0, 0, this.width, this.height);
        this.spriteBackground.endFill();

        this.displayObject.addChild(this.spriteBackground);
    }

    addChild(child) {
        child.id = ++this._childsIdCounter;
        this.childs[child.id] = child.id;
        this.displayObject.addChild(child.displayObject);
    }

    _mousedown(ev) {
        ev.originalEvent.stopPropagation();
    }

    show() {
        this.visible = true;
        this.displayObject.visible = true;
        this.onShow();
    }

    hide() {
        this.visible = false;
        this.displayObject.visible = false;
    }

    toggle() {
        this.visible = !this.visible;
        this.displayObject.visible = this.visible;

        if (this.visible) {
            this.onShow();
        }
    }
}

frame.create = function(options) {
    return new Frame(options);
};

export {frame as default};
