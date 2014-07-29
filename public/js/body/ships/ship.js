define(
    function(require) {
        var utils = require('utils');
        var p2 = require('p2');
        var _ = require('lodash');
        var PIXI = require('pixi');
        var Body = require('../body');
        var config = require('json!config');
        var assets = require('modules/assets');
        var camera = require('modules/camera');

        var Ship = function Ship(options) {
            Ship.super_.apply(this, arguments);

            this.forceThrust = options.forceThrust || 10000;
            this.forceSide = options.forceSide || 500;
            this.actionsArray = ['thrust', 'reverse', 'left', 'right'];
        };

        utils.inherits(Ship, Body);

        Ship.prototype.applyShape = function() {
            this.body.addShape(new p2.Rectangle(60, 40));
        };

        Ship.prototype.createSprite = function() {
            var _this = this;

            this.sprite = new PIXI.Sprite(assets.texture.ship);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;


            // спрайт для thrust
            this.spriteThrust = new PIXI.Sprite(assets.texture.thrust);
            this.spriteThrust.anchor.x = 0;
            this.spriteThrust.anchor.y = 0.5;
            this.spriteThrust.position.x = -45;
            this.spriteThrust.position.y = 0;
            this.sprite.addChild(this.spriteThrust);

            // боковые спрайты
            this.spriteSide = [];

            function createSideSprite(x, y) {
                var sprite = new PIXI.Sprite(assets.texture.side);
                sprite.position.x = x;
                sprite.position.y = y;
                _this.sprite.addChild(sprite);
                return sprite;
            }

            this.spriteSide[0] = createSideSprite(-30, -35);
            this.spriteSide[1] = createSideSprite(0, -35);
            this.spriteSide[2] = createSideSprite(-30, 10);
            this.spriteSide[3] = createSideSprite(0, 10);
        };

        Ship.prototype.updateSprite = function() {
            this.sprite.position.x = camera.x(this.body.position[0]);
            this.sprite.position.y = camera.y(this.body.position[1]);
            this.sprite.rotation = this.body.angle;
            this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());

            // проверям actions
            this.spriteThrust.visible = this.actions.thrust.isAnimate();

            this.spriteSide[0].visible = false;
            this.spriteSide[1].visible = false;
            this.spriteSide[2].visible = false;
            this.spriteSide[3].visible = false;

            if (this.actions.left.isAnimate()) {
                this.spriteSide[0].visible = true;
                this.spriteSide[3].visible = true;
            } else if (this.actions.right.isAnimate()) {
                this.spriteSide[1].visible = true;
                this.spriteSide[2].visible = true;
            }
        };

        Ship.prototype.addToGame = function(game) {
            game.world.addBody(this.body);
            game.stage.addChild(this.sprite);
        };

        return Ship;
    }
);