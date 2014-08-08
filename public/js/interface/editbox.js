define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var config = require('json!config');
        var position = require('./position');
        var key = require('modules/key');

        var editbox = {};

        var Editbox = function(options) {
            options = options || {};
            this.color = options.color || 'blue';

            switch (this.color) {
                case 'blue':
                    this.fillColor = '6f84b5';
                    this.strokeColor = '1a59e8';
                    break;
                case 'red':
                    this.fillColor = 'ba3737';
                    this.strokeColor = '980707';
                    break;

            }

            this.width = options.width || 100;
            this.height = options.height || 30;

            if (options.anchor !== undefined) {
                this.anchor = position[options.anchor];
            } else {
                this.anchor = position.TOPLEFT;
            }
            this.position = options.position || [0, 0];

            this.displayObject = new PIXI.DisplayObjectContainer();
            this.displayObject.buttonMode = true;
            this.displayObject.interactive = true;
            this.displayObject.width = this.width;
            this.displayObject.height = this.height;
            this.displayObject.position.x = this.anchor[0] + this.position[0];
            this.displayObject.position.y = this.anchor[1] + this.position[1];
            this.displayObject.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
            this.displayObject.defaultCursor = 'text';

            game.stage.addChild(this.displayObject);

            this.isActive = false;

            this.sprite;
            this.text = options.text || '';
            this.spriteText;
            this.fontSize = options.fontSize || 16;
            this.paddingLeft = options.paddingLeft || 15;

            this._createBackground();
            this._createText();

            this.cursor;
            this.cursorInterval;
            this.cursorIntervalDelay = 500;
            this._createCursor();
            this.cursorPosition = this.text.length;
            this.updateCursor();

            this.displayObject.click = _.bind(this._click, this);
            this.displayObject.mouseover = _.bind(this._mouseover, this);
            this.displayObject.mouseout = _.bind(this._mouseout, this);
        };

        Editbox.prototype._createBackground = function() {
            var _this = this;

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
            this.spriteHover.visible = true;

            // fix blinked bug with first mouseover
            setTimeout(function() {
                _this.spriteHover.visible = false;
            }, 0);

            this.displayObject.addChild(this.spriteHover);
        };

        Editbox.prototype._createText = function(text) {
            var textOptions = {
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
            this.displayObject.addChild(this.spriteTextHelp);
        };

        Editbox.prototype._createCursor = function() {
            this.cursor = new PIXI.Graphics();
            this.cursor.lineStyle(2, 0xffffff, 1);
            this.cursor.moveTo(0, 0);
            this.cursor.lineTo(0, this.fontSize * 1.2);
            this.cursor.position.y = (this.height - this.fontSize * 1.2) / 2;
            this.cursor.visible = false;

            this.displayObject.addChild(this.cursor);
        };

        Editbox.prototype.updateCursor = function() {
            var _this = this;

            this.spriteText.setText(this.text);
            this.spriteTextHelp.setText(this.text.substr(0, this.cursorPosition));

            setTimeout(function() {
                _this.cursor.position.x = _this.paddingLeft + _this.spriteTextHelp.width;
            }, 50);

            if (this.isActive) {
                clearInterval(this.cursorInterval);
                this.cursor.visible = true;
                this.cursorInterval = setInterval(function () {
                    _this.cursor.visible = !_this.cursor.visible;
                }, this.cursorIntervalDelay);
            }
        };

        Editbox.prototype._cursorLeft = function() {
            if (this.cursorPosition > 0) {
                this.cursorPosition--;
            }
        };

        Editbox.prototype._cursorRight = function() {
            if (this.cursorPosition < this.text.length) {
                this.cursorPosition++;
            }
        };

        Editbox.prototype._cursorHome = function() {
            this.cursorPosition = 0;
        };

        Editbox.prototype._cursorEnd = function() {
            this.cursorPosition = this.text.length;
        };

        Editbox.prototype._backspace = function() {
            if (this.cursorPosition > 0) {
                this.text = this.text.substr(0, this.cursorPosition - 1) + this.text.substr(this.cursorPosition);
                this.cursorPosition--;
            }
        };

        Editbox.prototype._delete = function() {
            if (this.cursorPosition < this.text.length) {
                this.text = this.text.substr(0, this.cursorPosition) + this.text.substr(this.cursorPosition + 1);
            }
        };

        Editbox.prototype._addCharToText = function(ch) {
            this.text = this.text.substr(0, this.cursorPosition) + ch + this.text.substr(this.cursorPosition);
            this.cursorPosition++;
        };

        Editbox.prototype.active = function() {
            var _this = this;
            this.isActive = true;
            this.cursor.visible = true;

            if (editbox._active !== undefined) {
                editbox._active.deactive();
            }
            editbox._active = this;

            this.cursorInterval = setInterval(function() {
                _this.cursor.visible = !_this.cursor.visible;
            }, this.cursorIntervalDelay);

            key.enableWriteText(function(ch) {
                switch (ch) {
                    case 'LEFT':
                        _this._cursorLeft();
                        break;
                    case 'RIGHT':
                        _this._cursorRight();
                        break;
                    case 'BACKSPACE':
                        _this._backspace();
                        break;
                    case 'DELETE':
                        _this._delete();
                        break;
                    case 'HOME':
                        _this._cursorHome();
                        break;
                    case 'END':
                        _this._cursorEnd();
                        break;
                    case 'ENTER':
                        break;
                    default:
                        _this._addCharToText(ch);
                }

                _this.updateCursor();
            });
        };

        Editbox.prototype.deactive = function() {
            this.isActive = false;
            clearInterval(this.cursorInterval);
            this.cursor.visible = false;
            editbox._active = undefined;
        };

        Editbox.prototype._click = function() {
            this.active();
        };

        Editbox.prototype._mouseover = function() {
            this.sprite.visible = false;
            this.spriteHover.visible = true;
        };

        Editbox.prototype._mouseout = function() {
            this.sprite.visible = true;
            this.spriteHover.visible = false;
        };

        editbox._active = undefined;

        editbox.create = function(options) {
            return new Editbox(options);
        };

        return editbox;
    }
);