define(
    function(require) {
        var utils = require('utils');
        var p2 = require('p2');
        var PIXI = require('pixi');
        var Body = require('../body');
        var config = require('json!config');
        var assets = require('modules/assets');
        var camera = require('modules/camera');

        var Ship = function Ship(options) {
            Ship.super_.apply(this, arguments);

            this.forceThrust = options.forceThrust || 20000;
            this.forceSide = options.forceSide || 2000;
            this.userActions = ['thrust', 'reverse', 'left', 'right'];
            // TODO: придмать что с действиямиы
            //this.usedThrust = false;
        };

        utils.inherits(Ship, Body);

        Ship.prototype.applyShape = function() {
            this.body.addShape(new p2.Rectangle(60, 40));
        };

        Ship.prototype.createSprite = function() {
            this.sprite = new PIXI.Sprite(assets.texture.ship);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;

            this.thrustSprite = new PIXI.Sprite(assets.texture.thrust);
            this.thrustSprite.anchor.x = 0;
            this.thrustSprite.anchor.y = 0.5;
        };

        Ship.prototype.updateSprite = function() {
            this.sprite.position.x = camera.x(this.body.position[0]);
            this.sprite.position.y = camera.y(this.body.position[1]);
            this.sprite.rotation = this.body.angle;
            this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());

            this.thrustSprite.position.x = -45;
            this.thrustSprite.position.y = 0;
        };

        Ship.prototype.addToGame = function(game) {
            game.world.addBody(this.body);
            this.sprite.addChild(this.thrustSprite);
            game.stage.addChild(this.sprite);
        };

        return Ship;
    }
);