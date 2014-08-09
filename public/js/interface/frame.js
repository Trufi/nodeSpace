define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var config = require('json!config');
        var position = require('./position');

        var frame = {};

        var Frame = function (options) {
            options = options || {};

            this.width = options.width || 100;
            this.height = options.height || 30;

            if (options.anchor !== undefined) {
                this.anchor = position[options.anchor];
            } else {
                this.anchor = position.TOPLEFT;
            }
            this.position = options.position || [0, 0];

            this.displayObject = new PIXI.DisplayObjectContainer();
            this.displayObject.width = this.width;
            this.displayObject.height = this.height;
            this.displayObject.position.x = this.anchor[0] + this.position[0];
            this.displayObject.position.y = this.anchor[1] + this.position[1];

            game.stage.addChild(this.displayObject);

            this.childs = {};
            this._childsIdCounter = 0;
        };

        Frame.prototype.addChild = function(child) {
            child.id = ++this._childsIdCounter;
            this.childs[child.id] = child.id;
            this.displayObject.addChild(child.displayObject);
        };

        frame.create = function(options) {
            return new Frame(options);
        };

        return frame;
    }
);