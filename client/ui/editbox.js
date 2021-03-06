import PIXI from 'pixi.js';
import _ from 'lodash';

import key from '../modules/key';
import config from '../config';

const editbox = {};

class Editbox {
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
        }

        this.id = null;
        this.width = options.width || 300;
        this.height = options.height || 50;
        this.position = options.position || [0, 0];

        if (typeof options.onNext === 'function') {
            this.onNext = options.onNext;
        } else {
            this.onNext = function() {
            };
        }

        this.displayObject = new PIXI.Container();
        this.displayObject.buttonMode = true;
        this.displayObject.interactive = true;
        this.displayObject.width = this.width;
        this.displayObject.height = this.height;
        this.displayObject.position.x = this.position[0];
        this.displayObject.position.y = this.position[1];
        this.displayObject.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
        this.displayObject.defaultCursor = 'text';

        if (options.visible !== undefined) {
            this.displayObject.visible = options.visible;
        }

        this.isActive = false;

        this.sprite = null;
        this.text = options.text || '';
        this.spriteText = null;
        this.fontSize = options.fontSize || 22;
        this.paddingLeft = options.paddingLeft || 15;
        this.type = options.type;
        this.spriteTextHelp = null;
        this.mask = null;
        this.isTextOverWidth = false;

        this._createBackground();
        this._createText();

        this.cursor = null;
        this.cursorInterval = null;
        this.cursorIntervalDelay = 500;
        this._createCursor();
        this.cursorPosition = this.text.length;
        this.updateCursor();

        this.displayObject.click = _.bind(this._click, this);
        this.displayObject.mouseover = _.bind(this._mouseover, this);
        this.displayObject.mouseout = _.bind(this._mouseout, this);
        this.displayObject.mousedown = this._mousedown;
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
        const textOptions = {
            font: config.buttonFontWeight + ' ' + this.fontSize + 'px ' + config.buttonFontFamily,
            align: 'left',
            fill: '#fff',
            strokeThickness: 1,
            stroke: '#' + this.strokeColor,
            wordWrap: true,
            wordWrapWidth: this.width
        };

        this.spriteText = new PIXI.Text(this.text, textOptions);
        this.spriteText.position.x = this.paddingLeft;
        this.spriteText.position.y = (this.height - this.spriteText.height) / 2;
        this.displayObject.addChild(this.spriteText);

        this.spriteTextHelp = new PIXI.Text(this.text, textOptions);
        this.spriteTextHelp.visible = false;
        this.spriteTextHelp.anchor.x = 1;
        this.spriteTextHelp.position.x = this.width - this.paddingLeft;
        this.spriteTextHelp.position.y = (this.height - this.spriteText.height) / 2;
        this.displayObject.addChild(this.spriteTextHelp);

        // маска для текста
        this.maskText = new PIXI.Graphics();
        this.maskText.beginFill();
        this.maskText.drawRect(this.paddingLeft, 0, this.width - this.paddingLeft * 2, this.height);
        this.maskText.endFill();
        this.displayObject.addChild(this.maskText);
        this.spriteText.mask = this.maskText;
        this.spriteTextHelp.mask = this.maskText;
    }

    _createCursor() {
        this.cursor = new PIXI.Graphics();
        this.cursor.lineStyle(2, 0xffffff, 1);
        this.cursor.moveTo(0, 0);
        this.cursor.lineTo(0, this.fontSize * 1.2);
        this.cursor.position.y = (this.height - this.fontSize * 1.2) / 2;
        this.cursor.visible = false;

        this.displayObject.addChild(this.cursor);
    }

    checkForAlign() {
        if (this.spriteTextHelp.width >= this.width - this.paddingLeft * 2) {
            this.spriteText.visible = false;
            this.spriteTextHelp.visible = true;
            this.isTextOverWidth = true;
        } else {
            this.spriteText.visible = true;
            this.spriteTextHelp.visible = false;
            this.isTextOverWidth = false;
        }
    }

    updateCursor() {
        if (this.cursorPosition === 0) {
            this.cursor.position.x = this.paddingLeft;
        } else if (this.isTextOverWidth) {
            this.cursor.position.x = this.width - this.paddingLeft;
        } else {
            this.cursor.position.x = this.paddingLeft + this.spriteTextHelp.width;
        }

        // запускаем интервал мигания курсора
        if (this.isActive) {
            clearInterval(this.cursorInterval);
            this.cursor.visible = true;
            this.cursorInterval = setInterval(() => {
                this.cursor.visible = !this.cursor.visible;
            }, this.cursorIntervalDelay);
        }
    }

    _cursorLeft() {
        if (this.cursorPosition > 0) {
            this.cursorPosition--;
        }
    }

    _cursorRight() {
        if (this.cursorPosition < this.text.length) {
            this.cursorPosition++;
        }
    }

    _cursorHome() {
        this.cursorPosition = 0;
    }

    _cursorEnd() {
        this.cursorPosition = this.text.length;
    }

    _backspace() {
        if (this.cursorPosition > 0) {
            this.text = this.text.substr(0, this.cursorPosition - 1) + this.text.substr(this.cursorPosition);
            this.cursorPosition--;
        }
    }

    _delete() {
        if (this.cursorPosition < this.text.length) {
            this.text = this.text.substr(0, this.cursorPosition) + this.text.substr(this.cursorPosition + 1);
        }
    }

    _addCharToText(ch) {
        this.text = this.text.substr(0, this.cursorPosition) + ch + this.text.substr(this.cursorPosition);
        this.cursorPosition++;
    }

    _enter(ch) {
        this.deactive();
        this.onNext();
    }

    _tab(ch) {
        this.deactive();
        this.onNext();
    }

    active() {
        // bad
        setTimeout(() => {
            this.isActive = true;
            this.cursorPosition = this.text.length;

            if (editbox._active !== undefined) {
                editbox._active.deactive();
            }
            editbox._active = this;

            this.updateCursor();

            key.enableWriteText(ch => {
                let str;

                switch (ch) {
                    case 'LEFT':
                        this._cursorLeft();
                        break;
                    case 'RIGHT':
                        this._cursorRight();
                        break;
                    case 'BACKSPACE':
                        this._backspace();
                        break;
                    case 'DELETE':
                        this._delete();
                        break;
                    case 'HOME':
                        this._cursorHome();
                        break;
                    case 'END':
                        this._cursorEnd();
                        break;
                    case 'ENTER':
                        this._enter();
                        break;
                    case 'TAB':
                        this._tab();
                        break;
                    default:
                        this._addCharToText(ch);
                }

                if (this.type === 'pass') {
                    str = (new Array(this.text.length + 1)).join('*');
                } else {
                    str = this.text;
                }
                this.spriteText.text = str;
                this.spriteTextHelp.text = str.substr(0, this.cursorPosition);
                setTimeout(() => {
                    this.checkForAlign();
                    this.updateCursor();
                }, 30);
            });
        }, 0);
    }

    deactive() {
        this.isActive = false;
        clearInterval(this.cursorInterval);
        this.cursor.visible = false;
        editbox._active = undefined;
        key.disableWriteText();
    }

    _mousedown(ev) {
        ev.stopPropagation();
    }

    _click() {
        this.active();
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

    value() {
        return this.text;
    }

    addChild(child) {
        this.displayObject.addChild(child.displayObject);
    }
}

editbox._active = undefined;

window.addEventListener('click', function() {
    if (editbox._active !== undefined) {
        editbox._active.deactive();
    }
});

editbox.create = function(options) {
    return new Editbox(options);
};

export {editbox as default};
