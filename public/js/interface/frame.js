define(
    function(require) {
        var PIXI = require('pixi');
        var render = require('modules/render');
        var position = require('./position');

        var frame = {};

        var Frame = function (options) {
            options = options || {};

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
                this.onShow = function() {};
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
        };

        Frame.prototype._initColor = function(color) {
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
        };

        Frame.prototype.addChild = function(child) {
            child.id = ++this._childsIdCounter;
            this.childs[child.id] = child.id;
            this.displayObject.addChild(child.displayObject);
        };

        Frame.prototype._mousedown = function(ev) {
            ev.originalEvent.stopPropagation();
        };

        Frame.prototype.show = function() {
            this.visible = true;
            this.displayObject.visible = true;
            this.onShow();
        };

        Frame.prototype.hide = function() {
            this.visible = false;
            this.displayObject.visible = false;
        };

        Frame.prototype.toggle = function() {
            this.visible = !this.visible;
            this.displayObject.visible = this.visible;

            if (this.visible) {
                this.onShow();
            }
        };

        frame.create = function(options) {
            return new Frame(options);
        };

        return frame;
    }
);