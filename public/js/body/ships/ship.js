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
        var weapons = require('../weapons/index');
        var step = require('modules/step');
        var action = require('actions/index');

        var Ship = function Ship(options) {
            Ship.super_.apply(this, arguments);

            this.weapons = [];
        };

        utils.inherits(Ship, Body);

        Ship.prototype.applyActions = function() {
            var _this = this,
                actionsArray = [1, 2, 3, 4, 6, 7, 8];

            _(actionsArray).forEach(function(el) {
                _this.actions[el] = action.create({body: _this, name: el});
            });

            // добавляем действие для конкретного оружия
            this.actions[5] = action.create({body: this, name: 5, weapons: this.weapons});
        };

        Ship.prototype.applyWeapons = function() {
            this.weapons[0] = weapons.create({
                position: [-10, 0],
                parent: this
            });

            this.weapons[1] = weapons.create({
                position: [10, 0],
                parent: this
            });
        };

        Ship.prototype.weaponsAimActivate = function() {
            this.weapons[0].createAim();
            this.game.layers[4].addChild(this.weapons[0].spriteAim);
            this.weapons[1].createAim();
            this.game.layers[4].addChild(this.weapons[1].spriteAim);
        };

        Ship.prototype.weaponsGoto = function(point) {
            _(this.weapons).forEach(function (el) {
                el.goto(point);
            });
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

            // спрайт для reverse
            this.spriteReverse = new PIXI.Sprite(assets.texture.thrust);
            this.spriteReverse.anchor.x = 0;
            this.spriteReverse.anchor.y = 0.5;
            this.spriteReverse.position.x = 21;
            this.spriteReverse.position.y = 0;
            this.spriteReverse.height = 30;
            this.spriteReverse.width = 20;
            this.sprite.addChild(this.spriteReverse);

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
            this.spriteReverse.visible = this.actions[2].isAnimate(now);

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
            } else if (this.actions[6].isAnimate(now)) {
                this.spriteSide[2].visible = true;
                this.spriteSide[3].visible = true;
            } else if (this.actions[7].isAnimate(now)) {
                this.spriteSide[0].visible = true;
                this.spriteSide[1].visible = true;
            }
        };

        Ship.prototype.addToGame = function(game) {
            game.world.addBody(this.body);

            _(this.weapons).forEach(function(el) {
                step.addWeapon(el);
            });

            game.layers[2].addChild(this.sprite);

            this.game = game;
        };

        return Ship;
    }
);