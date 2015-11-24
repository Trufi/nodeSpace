import PIXI from 'pixi.js';
import _ from 'lodash';

import config from '../config';

let button = {};

class Button {
    constructor(options = {}) {
        this.color = options.color || 'blue';

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
        }

        this.id;
        this.width = options.width || 300;
        this.height = options.height || 50;
        this.position = options.position || [0, 0];

        this.displayObject = new PIXI.DisplayObjectContainer();
        this.displayObject.buttonMode = true;
        this.displayObject.interactive = true;
        this.displayObject.width = this.width;
        this.displayObject.height = this.height;
        this.displayObject.position.x = this.position[0];
        this.displayObject.position.y = this.position[1];
        this.displayObject.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);

        if (options.visible !== undefined) {
            this.displayObject.visible = options.visible;
        }

        this.sprite;
        this.spriteHover;
        this.text = options.text || '';
        this.spriteText;
        this.fontSize = options.fontSize || 22;

        this._createBackground();
        this._createText();

        this.displayObject.mouseover = _.bind(this._mouseover, this);
        this.displayObject.mouseout = _.bind(this._mouseout, this);

        if (typeof options.click === 'function') {
            this.clickCallback = options.click;
        } else {
            this.clickCallback = function() {
            };
        }
        this.displayObject.click = _.bind(this.click, this);
        this.displayObject.mousedown = this._mousedown;
    }

    click() {
        this.clickCallback();
    }

    _createBackground() {
        this.sprite = new PIXI.Graphics();
        this.sprite.lineStyle(1, parseInt('0x' + this.strokeColor, 16), 1);
        this.sprite.beginFill(parseInt('0x' + this.strokeColor, 16), 0.5);
        this.sprite.drawRect(0, 0, this.width, this.height);
        this.sprite.endFill();

        this.displayObject.addChild(this.sprite);

        this.spriteHover = new PIXI.Graphics();
        this.spriteHover.lineStyle(1, parseInt('0x' + this.strokeColor, 16), 1);
        this.spriteHover.beginFill(parseInt('0x' + this.strokeColor, 16), 0.7);
        this.spriteHover.drawRect(0, 0, this.width, this.height);
        this.spriteHover.endFill();
        this.spriteHover.visible = false;

        this.displayObject.addChild(this.spriteHover);
    }

    _createText() {
        this.spriteText = new PIXI.Text(this.text, {
            font: config.buttonFontWeight + ' ' + this.fontSize + 'px ' + config.buttonFontFamily,
            align: 'center',
            fill: '#fff',
            strokeThickness: 1,
            stroke: '#' + this.strokeColor,
            wordWrap: true,
            wordWrapWidth: this.width
        });
        this.spriteText.position.x = (this.width - this.spriteText.width) / 2;
        this.spriteText.position.y = (this.height - this.spriteText.height) / 2;
        this.displayObject.addChild(this.spriteText);
    }

    _mousedown(ev) {
        ev.originalEvent.stopPropagation();
    }

    _mouseover() {
        // fix blinked bug with first mouseover
        setTimeout(() => {
            this.sprite.visible = false;
            this.spriteHover.visible = true;
        }, 0);
    }

    _mouseout() {
        this.sprite.visible = true;
        this.spriteHover.visible = false;
    }

    addChild(child) {
        this.displayObject.addChild(child.displayObject);
    }
}

button.create = function(options) {
    return new Button(options);
};

export {button as default};
