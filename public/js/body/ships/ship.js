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
        var mask = require('../mask');
        var weapons = require('weapons/index');
        var render = require('modules/render');
        var util = require('utils');

        var Ship = function Ship(options) {
            Ship.super_.apply(this, arguments);

            this.forceThrust = options.forceThrust || 10000;
            this.forceSide = options.forceSide || 500;
            this.actionsArray = [1, 2, 3, 4, 5];

            this.weapons = {};
        };

        utils.inherits(Ship, Body);

        Ship.prototype.applyWeapons = function() {
            var weapon = weapons.create({
                relativePosition: [-10, 5]
            });

            this.weapons[0] = weapon;

           /* weapon = weapons.create({
                relativePosition: [10, 5]
            });

            this.weapons[1] = weapon;*/
        };

        Ship.prototype.weaponsGoto = function(point) {
            var pointPos,
                bodyAngle = util.resetAngle(this.body.angle);

            if (point.x !== 0) {
                pointPos = [point.x - render.resolution[0] / 2, point.y - render.resolution[1] / 2];

                _(this.weapons).forEach(function (el) {
                    var weaponPos,
                        angle;

                    weaponPos = [el.relativePosition[0] * Math.cos(bodyAngle), el.relativePosition[1] * Math.sin(bodyAngle)];
                    angle = Math.atan2((pointPos[1] - weaponPos[1]), (pointPos[0] - weaponPos[0])) - bodyAngle;

                    angle = util.resetAngle(angle);
                    el.gotoAngle(angle, bodyAngle);
                });
            }
        };

        Ship.prototype.applyShape = function() {
            this.shape = new p2.Rectangle(60, 40);
            this.shape.collisionGroup = mask.SHIP;
            this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
            this.body.addShape(this.shape);
        };

        Ship.prototype.createSprite = function() {
            var _this = this;

            this.sprite = new PIXI.Sprite(assets.texture.ship);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;

            this.spriteSize = 60;


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

            this.applyWeapons();
        };

        Ship.prototype.updateSprite = function(now) {
            this.sprite.position.x = camera.x(this.body.position[0]);
            this.sprite.position.y = camera.y(this.body.position[1]);
            this.sprite.rotation = this.body.angle;
            this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());

            // проверям actions
            this.spriteThrust.visible = this.actions[1].isAnimate(now);

            this.spriteSide[0].visible = false;
            this.spriteSide[1].visible = false;
            this.spriteSide[2].visible = false;
            this.spriteSide[3].visible = false;

            if (this.actions[3].isAnimate(now)) {
                this.spriteSide[0].visible = true;
                this.spriteSide[3].visible = true;
            } else if (this.actions[4].isAnimate(now)) {
                this.spriteSide[1].visible = true;
                this.spriteSide[2].visible = true;
            }
        };

        Ship.prototype.addToGame = function(game) {
            game.world.addBody(this.body);

            _(this.weapons).forEach(function(el) {
                game.world.addBody(el.body);
                game.layers[4].addChild(el.sprite);
            });

            game.layers[2].addChild(this.sprite);
        };

        return Ship;
    }
);