define(
    function(require) {
        var PIXI = require('pixi');
        var p2 = require('p2');
        var util = require('utils');
        var assets = require('modules/assets');
        var render = require('modules/render');

        var weapons = {};
        var idCounter = 1;
        //weapons.list = {};

        var Weapon = function Weapon(options) {
            this.id = options.id;

            this.angularSpeed = options.angularSpeed || 5;
            //this.toAngle = options.angle || 0;
            this.relativePosition = options.relativePosition || [0, 0];

            this.radius = 200;

            this.body = new p2.Body({
                mass: 1,
                position: [0, 0],
                velocity: [0, 0],
                damping: 0,
                angularDamping: 0,
                angle: options.angle || 0.5,
                angularVelocity: 0
            });
            this.body.addShape(new p2.Circle(0));

            this.sprite = new PIXI.Sprite(assets.texture.debug);
            this.sprite.width = 10;
            this.sprite.height = 10;
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.position.x = -100;
            this.sprite.position.y = -100;
        };

        Weapon.prototype.gotoAngle = function(angle, parentAngle) {
            var toAngle = util.resetAngle(angle - this.body.angle);
            if (toAngle <= Math.PI) {
                this.body.angularVelocity = this.angularSpeed;
            } else {
                this.body.angularVelocity = -this.angularSpeed;
            }

            if (toAngle < Math.PI / 10) {
                this.body.angularVelocity = 0;
                this.body.angle = angle;
            }

            this.sprite.position.x = this.radius * Math.cos(this.body.angle + parentAngle) + render.resolution[0] / 2;
            this.sprite.position.y = this.radius * Math.sin(this.body.angle + parentAngle) + render.resolution[1] / 2;
        };

        weapons.create = function(options) {
            var weapon;

            options = options || {};
            options.id = idCounter++;

            weapon = new Weapon(options);
            return weapon;
        };

        return weapons;
    }
);