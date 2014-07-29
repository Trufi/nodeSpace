define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var _ = require('lodash');
        var shapes = require('json!./shapes.json');
        var camera = require('modules/camera');
        var assets = require('modules/assets');
        var action = require('actions/index');

        // Класс простейшего тела
        var Body = function Body(options) {
            this.id = options.id;
            this.type = options.type;
            this.body;
            this.sprite;

            this.actionsArray = [];
            this.actions = {};
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

        Body.prototype.applyActions = function() {
            var _this = this;

            _(this.actionsArray).forEach(function(el) {
                _this.actions[el] = action.create({body: _this, name: el});
            });
        };

        Body.prototype.createSprite = function() {};

        Body.prototype.addToGame = function(game) {
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