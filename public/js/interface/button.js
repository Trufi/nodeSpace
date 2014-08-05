define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var config = require('json!config');
        var position = require('./position');

        var button = {};

        var Button = function(options) {
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

            game.stage.addChild(this.displayObject);

            this.sprite;
            this.text;
            this.fontSize = options.fontSize || 16;

            this.createBackground();
            this.createText(options.text || ' ');

            this.displayObject.mouseover = _.bind(this._mouseover, this);
            this.displayObject.mouseout = _.bind(this._mouseout, this);
            if (options.click !== undefined) {
                this.click(options.click);
            }
        };

        Button.prototype.createBackground = function() {
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

            // fix blinked bug
            setTimeout(function() {
                _this.spriteHover.visible = false;
            }, 0);

            this.displayObject.addChild(this.spriteHover);
        };

        Button.prototype.createText = function(text) {
            this.text = new PIXI.Text(text, {
                font: config.buttonFontWeight + ' ' + this.fontSize + 'px ' + config.buttonFontFamily,
                align: 'center',
                fill: '#fff',
                strokeThickness: 1,
                stroke: '#' + this.strokeColor,
                wordWrap: true,
                wordWrapWidth: this.width
            });
            this.text.position.x = (this.width - this.text.width) / 2;
            this.text.position.y = (this.height - this.text.height) / 2;
            this.displayObject.addChild(this.text);
        };

        Button.prototype.click = function(callback) {
            this.displayObject.click = callback;
        };

        Button.prototype._mouseover = function() {
            this.sprite.visible = false;
            this.spriteHover.visible = true;
        };

        Button.prototype._mouseout = function() {
            this.sprite.visible = true;
            this.spriteHover.visible = false;
        };

        button.create = function(options) {
            return new Button(options);
        };

        return button;
    }
);