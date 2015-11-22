var PIXI = require('pixi.js');
var util = require('util');
var p2 = require('p2');

var assets = require('../modules/assets');
var Body = require('./body');

var Rectangle = function Rectangle(options) {
    Rectangle.super_.apply(this, arguments);
};

util.inherits(Rectangle, Body);

Rectangle.prototype.applyShape = function() {
    this.body.addShape(new p2.Rectangle(100, 100));
};

Rectangle.prototype.createSprite = function() {
    this.sprite = new PIXI.Sprite(assets.texture.rectangle);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
};

module.exports = Rectangle;
