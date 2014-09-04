define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var config = require('json!config');
        var position = require('./position');
        var key = require('modules/key');

        var editbox = {};

        var Editbox = function(options) {
            options = options || {};
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

            this.id;
            this.width = options.width || 300;
            this.height = options.height || 50;
            this.position = options.position || [0, 0];

            if (typeof options.onNext === 'function') {
                this.onNext = options.onNext;
            } else {
                this.onNext = function() {};
            }

            this.displayObject = new PIXI.DisplayObjectContainer();
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

            this.sprite;
            this.text = options.text || '';
            this.spriteText;
            this.fontSize = options.fontSize || 22;
            this.paddingLeft = options.paddingLeft || 15;
            this.type = options.type;
            this.spriteTextHelp;
            this.mask;
            this.isTextOverWidth = false;


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
            this.displayObject.mousedown = this._mousedown;
        };

        Editbox.prototype._createBackground = function() {
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

        Editbox.prototype.checkForAlign = function() {
            if (this.spriteTextHelp.width >= this.width - this.paddingLeft * 2) {
                this.spriteText.visible = false;
                this.spriteTextHelp.visible = true;
                this.isTextOverWidth = true;
            } else {
                this.spriteText.visible = true;
                this.spriteTextHelp.visible = false;
                this.isTextOverWidth = false;
            }
        };

        Editbox.prototype.updateCursor = function() {
            var _this = this;

            if (this.cursorPosition === 0) {
                this.cursor.position.x = this.paddingLeft;
            } else {
                if (_this.isTextOverWidth) {
                    _this.cursor.position.x = _this.width - _this.paddingLeft;
                } else {
                    _this.cursor.position.x = _this.paddingLeft + _this.spriteTextHelp.width;
                }
            }

            // запускаем интервал мигания курсора
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

        Editbox.prototype._enter = function(ch) {
            this.deactive();
            this.onNext();
        };

        Editbox.prototype._tab = function(ch) {
            this.deactive();
            this.onNext();
        };

        Editbox.prototype.active = function() {
            var _this = this;

            // bad
            setTimeout(function() {
                _this.isActive = true;
                _this.cursorPosition = _this.text.length;

                if (editbox._active !== undefined) {
                    editbox._active.deactive();
                }
                editbox._active = _this;


                _this.updateCursor();

                key.enableWriteText(function(ch) {
                    var str;

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
                            _this._enter();
                            break;
                        case 'TAB':
                            _this._tab();
                            break;
                        default:
                            _this._addCharToText(ch);
                    }

                    if (_this.type === 'pass') {
                        str = (new Array(_this.text.length + 1)).join('*');
                    } else {
                        str = _this.text;
                    }
                    _this.spriteText.setText(str);
                    _this.spriteTextHelp.setText(str.substr(0, _this.cursorPosition));
                    setTimeout(function() {
                        _this.checkForAlign();
                        _this.updateCursor();
                    }, 30);
                });
            }, 0);
        };

        Editbox.prototype.deactive = function() {
            this.isActive = false;
            clearInterval(this.cursorInterval);
            this.cursor.visible = false;
            editbox._active = undefined;
            key.disableWriteText();
        };

        Editbox.prototype._mousedown = function(ev) {
            ev.originalEvent.stopPropagation();
        };

        Editbox.prototype._click = function() {
            this.active();
        };

        Editbox.prototype._mouseover = function() {
            var _this = this;

            // fix blinked bug with first mouseover
            setTimeout(function() {
                _this.sprite.visible = false;
                _this.spriteHover.visible = true;
            }, 0);
        };

        Editbox.prototype._mouseout = function() {
            this.sprite.visible = true;
            this.spriteHover.visible = false;
        };

        Editbox.prototype.value = function() {
            return this.text;
        };

        Editbox.prototype.addChild = function(child) {
            this.displayObject.addChild(child.displayObject);
        };

        editbox._active = undefined;

        window.addEventListener('click', function() {
            if (editbox._active !== undefined) {
                editbox._active.deactive();
            }
        });

        editbox.create = function(options) {
            return new Editbox(options);
        };

        return editbox;
    }
);