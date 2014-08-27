define(
    function(require) {
        var PIXI = require('pixi');
        var _ = require('lodash');
        var assets = require('modules/assets');
        var render = require('modules/render');
        var camera = require('modules/camera');

        var weapons = {};
        var idCounter = 1;

        function resetAngle(angle) {
            var sign = angle > 0 ? 1 : -1;
            return sign * ((Math.abs(angle) + Math.PI) % (Math.PI * 2) - Math.PI);
        }

        var Weapon = function Weapon(options) {
            this.id = options.id;

            this.parent = options.parent;
            this.angularVelocity = options.angularVelocity || 5;
            this.toAngle = options.angle || 0;
            this.position = options.position || [0, 0];

            this.radius = 200;
            this.angle = 0;

            this.sprite = new PIXI.Sprite(assets.texture.debug);
            this.sprite.width = 10;
            this.sprite.height = 10;
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.position.x = -100;
            this.sprite.position.y = -100;
        };

        Weapon.prototype.step = function(dt) {
            var dAngle = this.angularVelocity * dt,
                angleNeed = resetAngle(this.angle - this.toAngle),
                sign = angleNeed > 0 ? 1 : -1;

            angleNeed = Math.abs(angleNeed);

            if (angleNeed < dAngle) {
                this.angle = this.toAngle;
            } else {
                if (angleNeed < Math.PI * 2 - angleNeed) {
                    this.angle = this.angle - sign * dAngle;
                } else {
                    this.angle = this.angle + sign * dAngle;
                }
            }
        };

        Weapon.prototype.updateSprite = function() {
            var angle = this.angle,
                angleNeed = Math.abs(resetAngle(angle - this.toAngle));

            if (angleNeed < Math.PI / 16) {
                angle = this.toAngle;
            }

            this.sprite.position.x = this.radius * Math.cos(angle + this.parent.body.angle) + render.resolution[0] / 2;
            this.sprite.position.y = this.radius * Math.sin(angle + this.parent.body.angle) + render.resolution[1] / 2;
        };

        Weapon.prototype.goto = function(point) {
            var pointPos = [point.x - render.resolution[0] / 2, point.y - render.resolution[1] / 2],
                parentAngle = this.parent.body.angle,
                weaponPos = [this.position[0] * Math.cos(parentAngle) * camera.scale(), this.position[1] * Math.sin(parentAngle) * camera.scale()];

            this.toAngle = Math.atan2((pointPos[1] - weaponPos[1]), (pointPos[0] - weaponPos[0])) - parentAngle;

            this.updateSprite();
        };

        weapons.create = function(options) {
            options = options || {};
            options.id = idCounter++;

            return new Weapon(options);
        };

        return weapons;
    }
);