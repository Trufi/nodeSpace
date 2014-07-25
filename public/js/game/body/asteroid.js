define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var shapes = require('json!./shapes.json');
        var utils = require('utils');
        var Body = require('./body');
        var assets = require('game/assets');

        var Asteroid = function Asteroid(options) {
            Asteroid.super_.apply(this, arguments);
        };

        utils.inherits(Asteroid, Body);

        Asteroid.prototype.applyShape = function() {
            this.body.addShape(new p2.Circle(87.5));
        };

        Asteroid.prototype.createSprite = function() {
            this.sprite = new PIXI.Sprite(assets.texture.asteroid);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
        };

        return Asteroid;
    }
);