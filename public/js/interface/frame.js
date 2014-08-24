define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
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

            if (options.visible !== undefined) {
                this.displayObject.visible = options.visible;
            }

            game.stage.addChild(this.displayObject);

            this.childs = {};
            this._childsIdCounter = 0;
        };

        Frame.prototype.addChild = function(child) {
            child.id = ++this._childsIdCounter;
            this.childs[child.id] = child.id;
            this.displayObject.addChild(child.displayObject);
        };

        Frame.prototype.show = function() {
            this.displayObject.visible = true;
            this.onShow();
        };

        Frame.prototype.hide = function() {
            this.displayObject.visible = false;
        };

        frame.create = function(options) {
            return new Frame(options);
        };

        return frame;
    }
);