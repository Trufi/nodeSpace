var p2 = require('p2');
var shapes = require('./shapes');
var _ = require('lodash');
var action = require('../actions/index');

// Класс простейшего тела
var Body = function Body(options) {
    this.id = options.id;
    this.type = options.type;
    this.body;
    this.texture;
    this.game;
    this.hp = 0;

    this.actions = {};
    // список доступных действий этого тела
    this.actionsArray = [];
    // список использованный действий в шаге игры
    this.actionsUsed = [];
};

Body.prototype.createBody = function(options) {
    this.body = new p2.Body({
        mass: options.mass || 1000,
        position: options.position || [0, 0],
        velocity: options.velocity || [0, 0],
        damping: 0,
        angularVelocity: options.angularVelocity || 0,
        angularDamping: 0,
        angle: options.angle || 0
    });

    this.body._gameBody = this;
};

Body.prototype.applyShape = function() {
    this.body.addShape(new p2.Circle(87.5));
};

Body.prototype.applyActions = function() {
    var _this = this;

    _(this.actionsArray).forEach(function(el) {
        _this.actions[el] = action.create({body: _this, name: el});
    });
};

Body.prototype.getFirstInfo = function() {
    return {
        type: this.type,
        mass: this.body.mass,
        position: [
            this.body.position[0],
            this.body.position[1]
        ],
        velocity: [
            this.body.velocity[0],
            this.body.velocity[1]
        ],
        angularVelocity: this.body.angularVelocity,
        angle: this.body.angle,
        id: this.id,
        hp: this.hp
    };
};

Body.prototype.getInfo = function() {
    return {
        position: [
            this.body.position[0],
            this.body.position[1]
        ],
        velocity: [
            this.body.velocity[0],
            this.body.velocity[1]
        ],
        angularVelocity: this.body.angularVelocity,
        angle: this.body.angle,
        id: this.id,
        actionsUsed: this.actionsUsed,
        hp: this.hp
    };
};

Body.prototype.resetActionsUsed = function() {
    this.actionsUsed = [];
};

Body.prototype.update = function() {};

Body.prototype.destroy = function() {
    if (this.game !== undefined) {
        this.game.removeBody(this);
    }
    this.body._gameBody = undefined;
    this.body.removeShape();
};

Body.prototype.damage = function() {};

module.exports = Body;