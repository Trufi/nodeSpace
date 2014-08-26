var p2 = require('p2');
var shapes = require('./shapes');
var _ = require('lodash');
var action = require('../actions/index');
var config = require('config');

// Класс простейшего тела
var Body = function Body(options) {
    this.id = options.id;
    this.type = options.type;
    this.body;
    this.texture;
    this.game;
    this.name = options.name;
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
    var info = [];
    info[0] = this.id;
    info[1] = this.type;
    info[2] = [Math.floor(this.body.position[0] * 100) / 100, Math.floor(this.body.position[1] * 100) / 100];
    info[3] = [Math.floor(this.body.velocity[0] * 100) / 100, Math.floor(this.body.velocity[1] * 100) / 100];
    info[4] = Math.floor(this.body.angularVelocity * 100) / 100;
    info[5] = Math.floor(this.body.angle * 100) / 100;
    info[6] = this.actionsUsed;
    info[7] = Math.floor(this.hp * 100) / 100;
    info[8] = this.body.mass;

    if (this.name !== undefined) {
        info[9] = this.name;
    }

    return info;
};

Body.prototype.getInfo = function() {
    var info = [];
    info[0] = this.id;

    // в firstInfo это this.type
    info[1] = 0;

    info[2] = [Math.floor(this.body.position[0] * 100) / 100, Math.floor(this.body.position[1] * 100) / 100];
    info[3] = [Math.floor(this.body.velocity[0] * 100) / 100, Math.floor(this.body.velocity[1] * 100) / 100];
    info[4] = Math.floor(this.body.angularVelocity * 100) / 100;
    info[5] = Math.floor(this.body.angle * 100) / 100;
    info[6] = this.actionsUsed;
    info[7] = Math.floor(this.hp * 100) / 100;
    return info;
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