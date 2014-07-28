define(
    function(require) {
        var utils = require('utils');
        var p2 = require('p2');
        var PIXI = require('pixi');
        var Body = require('../body');
        var config = require('json!config');
        var assets = require('modules/assets');

        var Ship = function Ship(options) {
            Ship.super_.apply(this, arguments);

            // запоминаем последнее использование, чтобы запретить абуз
            this.lastTimeAbilities = {
                thrust: 0
            };

            this.forceThrust = 1000;
        };

        utils.inherits(Ship, Body);

        Ship.prototype.applyShape = function() {
            this.body.addShape(new p2.Rectangle(40, 60));
        };

        Ship.prototype.createSprite = function() {
            this.sprite = new PIXI.Sprite(assets.texture.ship);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
        };

        Ship.prototype.checkAbilities = function(name) {
            var now = Date.now();

            if (now - this.lastTimeAbilities[name] > config.timeAbilityRepeat) {
                this.lastTimeThrust = now;
                return true;
            } else {
                return false;
            }
        };

        // газ
        Ship.prototype.thrust = function() {
/*            var worldPoint, force;

            if (this.checkAbilities('thrust')) {
                this.body.toWorldFrame(worldPoint, [0, -20]);
                force = [this.forceThrust * Math.cos(this.body.angle), this.forceThrust * Math.sin(this.body.angle)];
                this.body.applyForce(force, worldPoint);
            }*/

            if (this.checkAbilities('thrust')) {

            }
        };

        return Ship;
    }
);