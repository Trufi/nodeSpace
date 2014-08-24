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
            this.spriteSize = 100;
            this.shape;
            this.game;
            this.name = options.name || 'Unknown';
            this.hp = options.hp;

            this.actions = {};
            // список доступных действий этого корабля
            this.actionsArray = [];
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

            this.body._gameBody = this;
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
            game.layers[2].addChild(this.sprite);
            this.game = game;
        };

        Body.prototype.removeFromGame = function() {
            this.game.world.removeBody(this.body);
            this.game.layers[2].removeChild(this.sprite);
            this.game = undefined;
        };

        Body.prototype.updateSprite = function() {
            this.sprite.position.x = camera.x(this.body.position[0]);
            this.sprite.position.y = camera.y(this.body.position[1]);
            this.sprite.rotation = this.body.angle;
            this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());
        };

        Body.prototype.update = function(data) {
            var _this = this;

            this.body.position = data.position;
            this.body.velocity = data.velocity;
            this.body.angle = data.angle;
            this.body.angularVelocity = data.angularVelocity;

            this.hp = data.hp;

            _(data.actionsUsed).forEach(function(el) {
                _this.action(el);
            });
        };

        Body.prototype.action = function(name) {
            if (this.actions[name] !== undefined) {
                this.actions[name].use();
            }
        };

        Body.prototype.destroy = function() {
            if (this.game !== undefined) {
                this.game.removeBody(this);
            }
            this.body._gameBody = undefined;
        };

        return Body;
    }
);