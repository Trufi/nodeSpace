define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var utils = require('game/utils');
        var Body = require('./body');
        var assets = require('game/assets');

        var Rectangle = function Rectangle(options) {
            Rectangle.super_.apply(this, arguments);
        };

        utils.inherits(Rectangle, Body);

        Rectangle.prototype.applyShape = function() {
            this.body.addShape(new p2.Rectangle(100, 100));
        };

        Rectangle.prototype.createSprite = function() {
            this.sprite = new PIXI.Sprite(assets.texture.rectangle);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
        };

        return Rectangle;
    }
);