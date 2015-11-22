import util from 'util';
import _ from 'lodash';
import p2 from 'p2';

import * as actions from '../../actions';
import * as weapons from '../weapons';
import Bullet from '../bullets/Bullet';
import Body from '../Body';
import mask from '../mask';

export default function Ship(options) {
    Ship.super_.apply(this, arguments);

    this.forceThrust = options.forceThrust || 50000;
    this.forceSide = options.forceSide || 15000;
    this.client;
    this.hp = 100;

    this.weapons = [];
}

util.inherits(Ship, Body);

Ship.prototype.applyActions = function() {
    var _this = this,
        actionsArray = [1, 2, 3, 4, 6, 7, 8];

    _.forEach(actionsArray, function(el) {
        _this.actions[el] = actions.create({body: _this, name: el});
    });

    // добавляем действие для конкретного оружия
    this.actions[5] = actions.create({body: this, name: 5, weapons: this.weapons});
};

Ship.prototype.applyWeapons = function() {
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
Ship.prototype.thrust = function() {
    var worldPoint = [],
        force = [this.forceThrust * Math.cos(this.body.angle), this.forceThrust * Math.sin(this.body.angle)];

    this.body.toWorldFrame(worldPoint, [-20, 0]);
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.reverse = function() {
    var worldPoint = [],
        force = [-this.forceSide * Math.cos(this.body.angle), -this.forceSide * Math.sin(this.body.angle)];

    this.body.toWorldFrame(worldPoint, [20, 0]);
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.left = function() {
    var worldPoint = [],
        force;

    // первый двигатель
    this.body.toWorldFrame(worldPoint, [-10, 10]);
    force = [-this.forceSide * Math.sin(this.body.angle), this.forceSide * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
    // второй двигатель
    this.body.toWorldFrame(worldPoint, [10, -10]);
    force = [this.forceSide * Math.sin(this.body.angle), -this.forceSide * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.right = function() {
    var worldPoint = [],
        force;

    // первый двигатель
    this.body.toWorldFrame(worldPoint, [10, 10]);
    force = [-this.forceSide * Math.sin(this.body.angle), this.forceSide * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
    // второй двигатель
    this.body.toWorldFrame(worldPoint, [-10, -10]);
    force = [this.forceSide * Math.sin(this.body.angle), -this.forceSide * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.strafeLeft = function() {
    var worldPoint = [],
        force;

    // первый двигатель
    this.body.toWorldFrame(worldPoint, [10, 10]);
    force = [this.forceSide * Math.sin(this.body.angle), -this.forceSide * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
    // второй двигатель
    this.body.toWorldFrame(worldPoint, [-10, 10]);
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.strafeRight = function() {
    var worldPoint = [],
        force;

    // первый двигатель
    this.body.toWorldFrame(worldPoint, [10, -10]);
    force = [-this.forceSide * Math.sin(this.body.angle), this.forceSide * Math.cos(this.body.angle)];
    this.body.applyForce(force, worldPoint);
    // второй двигатель
    this.body.toWorldFrame(worldPoint, [-10, -10]);
    this.body.applyForce(force, worldPoint);
};

Ship.prototype.angularBrake = function(now) {
    var eps = 0.15;

    if (Math.abs(this.body.angularVelocity) < eps) {
        this.body.angularVelocity = 0;
    } else if (this.body.angularVelocity > 0) {
        this.client.action(now, 3);
    } else {
        this.client.action(now, 4);
    }
};

Ship.prototype.damage = function(bodyB) {
    var damage;

    if (bodyB instanceof Bullet) {
        if (bodyB.parent.id !== this.id) {
            damage = bodyB.addDamage();
            bodyB.checkForDestroyAfterCollide();
        } else {
            damage = 0;
        }
    } else {
        damage = bodyB.addDamage() + Math.sqrt(this.body.vlambda[0] * this.body.vlambda[0] + this.body.vlambda[1] * this.body.vlambda[1]) * this.body.mass / 500;
        bodyB.checkForDestroyAfterCollide();
    }


    this.hp = this.hp - damage;
};

module.exports = Ship;
