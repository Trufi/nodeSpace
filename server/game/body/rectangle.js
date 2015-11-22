var p2 = require('p2');
var utils = require('util');
var Body = require('./body');

var Rectangle = function Rectangle(options) {
    Rectangle.super_.apply(this, arguments);
};

utils.inherits(Rectangle, Body);

Rectangle.prototype.applyShape = function() {
    this.body.addShape(new p2.Rectangle(100, 100));
};

module.exports = Rectangle;
