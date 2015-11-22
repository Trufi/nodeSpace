var util = require('util');
var PIXI = require('pixi.js');
var p2 = require('p2');

var assets = require('../modules/assets');
var Body = require('./body');
var mask = require('./mask');

var Asteroid = function Asteroid(options) {
    Asteroid.super_.apply(this, arguments);
};

util.inherits(Asteroid, Body);

Asteroid.prototype.applyShape = function() {
    this.shape = new p2.Circle(87.5);
    this.shape.collisionGroup = mask.BODY;
    this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
    this.body.addShape(this.shape);
};

Asteroid.prototype.createSprite = function() {
    this.sprite = new PIXI.Sprite(assets.texture.asteroid);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
};

module.exports = Asteroid;