define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var shapes = require('json!./shapes.json');
        var game = require('game/game');
        var camera = require('game/camera');
        var assets = require('game/assets');

        // Класс простейшего тела
        var Body = function Body(options) {
            this.id = options.id;
            this.type = options.type;
            this.body;
            this.sprite;
        };

        Body.prototype.createBody = function(options) {
            this.body = new p2.Body({
                mass: options.mass,
                position: options.position,
                velocity: options.velocity,
                damping: 0,
                angularVelocity: options.angularVelocity,
                angularDamping: 0,
                angle: options.angle
            });
        };

        Body.prototype.applyShape = function() {};

        Body.prototype.createSprite = function() {};

        Body.prototype.addToGame = function() {
            game.world.addBody(this.body);
            game.stage.addChild(this.sprite);
        };

        Body.prototype.updateSprite = function() {
            this.sprite.position.x = camera.x(this.body.position[0]);
            this.sprite.position.y = camera.y(this.body.position[1]);
            this.sprite.rotation = this.body.angle;
            this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());
        };

        Body.prototype.update = function(data) {
            this.body.position = data.position;
            this.body.velocity = data.velocity;
            this.body.angle = data.angle;
            this.body.angularVelocity = data.angularVelocity;
        };

        return Body;
    }
);