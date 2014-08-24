define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var camera = require('modules/camera');
        var config = require('json!config');
        var game = require('games/game');
        var assets = require('modules/assets');

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
            game.layers[1].addChild(this.displayObject);
            this.spriteName;
            this.spriteHp;

            this.createName();
            this.createHp();
            this.update();
        };

        BodyInfo.prototype.createName = function() {
            this.spriteName = new PIXI.Text(this.body.name, {
                font: config.interface.bodyInfo.fontWeight + ' ' + this.fontSize + 'px ' + config.interface.bodyInfo.fontFamily,
                fill: '#' + this.colorName,
                strokeThickness: 1
            });
            this.spriteName.anchor.x = 1;
            this.displayObject.addChild(this.spriteName);
        };

        BodyInfo.prototype.createHp = function() {
            this.spriteHp = new PIXI.Text(Math.floor(this.body.hp), {
                font: config.interface.bodyInfo.fontWeight + ' ' + this.fontSize + 'px ' + config.interface.bodyInfo.fontFamily,
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
            _(bodyInfo.list).forEach(function(el) {
                el.update();
            });
        };

        return bodyInfo;
    }
);