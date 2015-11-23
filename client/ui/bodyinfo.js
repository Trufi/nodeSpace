var PIXI = require('pixi.js');
var _ = require('lodash');

var render = require('../modules/render');
var config = require('../config');

var bodyInfo = {};
bodyInfo.list = {};
var idCounter = 0;

var BodyInfo = function(options) {
    this.id = ++idCounter;
    this.body = options.body;

    this.colorName = options.colorName || 'fff';
    this.colorHp = options.colorHp || 'fff';
    this.fontSize = options.fontSize || 16;
    this.padding = 30;

    this.displayObject = new PIXI.DisplayObjectContainer();
    render.layers[4].addChild(this.displayObject);
    this.spriteName;
    this.spriteHp;

    this.createName();
    this.createHp();
    this.update();
};

BodyInfo.prototype.createName = function() {
    this.spriteName = new PIXI.Text(this.body.name, {
        font: config.ui.bodyInfo.fontWeight + ' ' + this.fontSize + 'px ' + config.ui.bodyInfo.fontFamily,
        fill: '#' + this.colorName,
        strokeThickness: 1
    });
    this.spriteName.anchor.x = 1;
    this.displayObject.addChild(this.spriteName);
};

BodyInfo.prototype.createHp = function() {
    this.spriteHp = new PIXI.Text(Math.floor(this.body.hp), {
        font: config.ui.bodyInfo.fontWeight + ' ' + this.fontSize + 'px ' + config.ui.bodyInfo.fontFamily,
        align: 'center',
        fill: '#' + this.colorHp,
        strokeThickness: 1
    });
    this.spriteHp.anchor.x = 0;
    this.displayObject.addChild(this.spriteHp);
};

BodyInfo.prototype.update = function() {
    this.displayObject.position.x = this.body.sprite.position.x;
    this.displayObject.position.y = this.body.sprite.position.y;

    this.spriteHp.setText(Math.floor(this.body.hp));
    this.spriteHp.position.x = 5;
    this.spriteHp.position.y = -this.padding - this.body.spriteSize / 2 * this.body.sprite.scale.y;


    this.spriteName.position.x = -5;
    this.spriteName.position.y = -this.padding - this.body.spriteSize / 2 * this.body.sprite.scale.y;
};

bodyInfo.create = function(options) {
    var bi = new BodyInfo(options);
    bodyInfo.list[bi.id] = bi;
    return bi;
};

bodyInfo.update = function() {
    _.forEach(bodyInfo.list, function(el) {
        el.update();
    });
};

module.exports = bodyInfo;