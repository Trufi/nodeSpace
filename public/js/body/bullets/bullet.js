define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var utils = require('utils');
        var Body = require('../body');
        var assets = require('modules/assets');
        var mask = require('../mask');

        var Bullet = function Bullet(options) {
            Bullet.super_.apply(this, arguments);
        };

        utils.inherits(Bullet, Body);

        Bullet.prototype.createBody = function(options) {
            this.body = new p2.Body({
                mass: 1,
                position: options[2] || [0, 0],
                velocity: options[3] || [0, 0],
                damping: 0,
                angularVelocity: 0,
                angularDamping: 0,
                angle: 0
            });

            this.body._gameBody = this;
        };

        Bullet.prototype.applyShape = function() {
            this.shape = new p2.Circle(1);
            this.shape.collisionGroup = mask.BULLET;
            this.shape.collisionMask = mask.BODY | mask.SHIP;
            this.body.addShape(this.shape);
        };

        Bullet.prototype.createSprite = function() {
            this.sprite = new PIXI.Sprite(assets.texture.bullet);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
        };

        Bullet.prototype.update = function(data) {
            this.body.position[0] = data[2][0];
            this.body.position[1] = data[2][1];
            this.body.velocity[0] = data[3][0];
            this.body.velocity[1] = data[3][1];
        };

        Bullet.prototype.updateActions = function() {};

        return Bullet;
    }
);