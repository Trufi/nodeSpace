var utils = require('util');
var p2 = require('p2');
var _ = require('lodash');
var Body = require('../body');
var config = require('config');
var mask = require('../mask');
var body = require('../index');
var action = require('../../actions/index');
var weapons = require('../weapons');
var Bullet = require('../bullets/bullet');

var Ship = function Ship(options) {
    Ship.super_.apply(this, arguments);

    this.forceThrust = options.forceThrust || 10000;
    this.forceSide = options.forceSide || 500;

    this.hp = 100;
    this.actionsArray = [1, 2, 3, 4, 5];

    this.weapons = [];
};

utils.inherits(Ship, Body);

Ship.prototype.applyActions = function() {
    var _this = this,
        actionsArray = [1, 2, 3, 4];

    _(actionsArray).forEach(function(el) {
        _this.actions[el] = action.create({body: _this, name: el});
    });

    // добавляем действие для конкретного оружия
    this.actions[5] = action.create({body: this, name: 5, weapons: this.weapons});
};

Ship.prototype.applyWeapons = function () {
    this.weapons[0] = weapons.create({
        position: [-10, 0],
        parent: this
    });

    this.weapons[1] = weapons.create({
        position: [10, 0],
        parent: this
    });
};

Ship.prototype.applyShape = function () {
    this.shape = new p2.Rectangle(60, 40);
    this.shape.collisionGroup = mask.SHIP;
    this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
    this.body.addShape(this.shape);

    this.applyWeapons();
};

// газ
Ship.prototype.thrust = function () {
    var worldPoint = [],
        force = [this.forceThrust * Math.cos(this.body.angle), this.forceThrust * Math.sin(this.body.angle)];

    this.body.toWorldFrame(worldPoint, [-20, 0]);
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.reverse = function () {
    var worldPoint = [],
        force = [-this.forceSide * Math.cos(this.body.angle), -this.forceSide * Math.sin(this.body.angle)];

    this.body.toWorldFrame(worldPoint, [20, 0]);
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.left = function () {
    var worldPoint = [],
        force;

    // первый двигатель
    this.body.toWorldFrame(worldPoint, [-10, 10]);
    force = [-this.forceThrust * Math.sin(this.body.angle), this.forceThrust * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
    // второй двигатель
    this.body.toWorldFrame(worldPoint, [10, -10]);
    force = [this.forceThrust * Math.sin(this.body.angle), -this.forceThrust * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.right = function () {
    var worldPoint = [],
        force;

    // первый двигатель
    this.body.toWorldFrame(worldPoint, [10, 10]);
    force = [-this.forceThrust * Math.sin(this.body.angle), this.forceThrust * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
    // второй двигатель
    this.body.toWorldFrame(worldPoint, [-10, -10]);
    force = [this.forceThrust * Math.sin(this.body.angle), -this.forceThrust * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
};

/*Ship.prototype.fire = function() {
    var worldPoint = [];
    this.body.toWorldFrame(worldPoint, [50, 0]);

    this.game.addBody(
        body.create({
            type: 1000,
            position: [worldPoint[0], worldPoint[1]],
            velocity: [
                this.bulletVelocity * Math.cos(this.body.angle) + this.body.velocity[0],
                this.bulletVelocity * Math.sin(this.body.angle) + this.body.velocity[1]
            ]
        })
    );
};*/

Ship.prototype.damage = function(bodyB) {
    var addDamage, damage;

    if (bodyB instanceof Bullet) {
        if (bodyB.parent.id !== this.id) {
            addDamage = bodyB.addDamage();
            bodyB.checkForDestroyAfterCollide();
        } else {
            addDamage = 0;
        }
    } else {
        addDamage = bodyB.addDamage();
        bodyB.checkForDestroyAfterCollide();
    }

    damage = addDamage + Math.sqrt(this.body.vlambda[0] * this.body.vlambda[0] + this.body.vlambda[1] * this.body.vlambda[1]) * this.body.mass / 500;
    this.hp = this.hp - damage;
};

module.exports = Ship;
