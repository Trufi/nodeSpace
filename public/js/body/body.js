define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var _ = require('lodash');
        var camera = require('modules/camera');
        var assets = require('modules/assets');
        var action = require('actions/index');
        var render = require('modules/render');

        // Класс простейшего тела
        var Body = function Body(options) {
            this.id = options[0];
            this.type = options[1];
            this.body;
            this.sprite;
            this.spriteSize = 100;
            this.shape;
            this.game;
            this.name = options[9] || 'Unknown';
            this.hp = options[7];

            this.actions = {};
            // список доступных действий этого корабля
            this.actionsArray = [];
        };

        Body.prototype.createBody = function(options) {
            this.body = new p2.Body({
                mass: options[8],
                position: options[2],
                velocity: options[3],
                damping: 0,
                angularVelocity: options[4],
                angularDamping: 0,
                angle: options[5]
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
            render.layers[2].addChild(this.sprite);
            this.game = game;
        };

        Body.prototype.removeFromGame = function() {
            this.game.world.removeBody(this.body);
            render.layers[2].removeChild(this.sprite);
            this.game = undefined;
        };

        Body.prototype.updateSprite = function() {
            this.sprite.position.x = camera.x(this.body.position[0]);
            this.sprite.position.y = camera.y(this.body.position[1]);
            this.sprite.rotation = this.body.angle;
            this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());
        };

        Body.prototype.update = function(now, data) {
            this.body.position[0] = data[2][0];
            this.body.position[1] = data[2][1];
            this.body.velocity[0] = data[3][0];
            this.body.velocity[1] = data[3][1];
            this.body.angularVelocity = data[4];
            this.body.angle = data[5];
            this.hp = data[7];
        };

        Body.prototype.updateActions = function(now, data) {
            var _this = this;

            _(data[6]).forEach(function(el) {
                _this.action(now, el);
            });
        };

        Body.prototype.action = function(now, name) {
            if (this.actions[name] !== undefined) {
                this.actions[name].use(now);
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