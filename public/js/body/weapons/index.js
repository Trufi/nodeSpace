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
            this.angularVelocity = 5;
            this.toAngle = options.angle || 0;
            this.position = options.position || [0, 0];

            this.radius = 200;
            this.angle = 0;
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

        Weapon.prototype.createAim = function() {
            this.spriteAim = new PIXI.Sprite(assets.texture.aimRed);
            this.spriteAim.width = 20;
            this.spriteAim.height = 20;
            this.spriteAim.anchor.x = 0.5;
            this.spriteAim.anchor.y = 0.5;
            this.spriteAim.position.x = -100;
            this.spriteAim.position.y = -100;
        };

        Weapon.prototype.updateAim = function() {
            var angle = this.angle,
                angleNeed = Math.abs(resetAngle(angle - this.toAngle));

            if (angleNeed < Math.PI / 16) {
                angle = this.toAngle;
            }

            this.spriteAim.position.x = this.radius * Math.cos(angle + this.parent.body.angle) + render.resolution[0] / 2;
            this.spriteAim.position.y = this.radius * Math.sin(angle + this.parent.body.angle) + render.resolution[1] / 2;
        };

        Weapon.prototype.goto = function(point) {
            var pointPos = [point.x - render.resolution[0] / 2, point.y - render.resolution[1] / 2],
                parentAngle = this.parent.body.angle,
                weaponPos = [
                    this.position[0] * Math.cos(parentAngle) - this.position[1] * Math.sin(parentAngle),
                    this.position[0] * Math.sin(parentAngle) + this.position[1] * Math.cos(parentAngle)
                ];

            weaponPos = [weaponPos[0] * camera.scale(), weaponPos[1] * camera.scale()];

            this.toAngle = Math.atan2((pointPos[1] - weaponPos[1]), (pointPos[0] - weaponPos[0])) - parentAngle;

            this.updateAim();
        };

        Weapon.prototype.getAngle = function() {
            return this.angle;
        };

        weapons.create = function(options) {
            options = options || {};
            options.id = idCounter++;

            return new Weapon(options);
        };

        return weapons;
    }
);