var PIXI = require('pixi.js');

var config = require('../config');

var render = {};

// stage из pixi.js
render.stage;
// уровни в stage
render.layers = [];

render.create = function(options) {
    var gameWrap = document.getElementById(config.gameHtmlWrapId),
        i;

    options = options || {};

    // разрешение рендера
    this.resolution = options.resolution || [window.innerWidth, window.innerHeight];

    this.render = PIXI.autoDetectRenderer(this.resolution[0], this.resolution[1]);
    this.render.view.style.display = 'block';

    document.getElementById('gamepreloader').style.display = 'none';
    gameWrap.style.display = 'block';
    gameWrap.appendChild(this.render.view);

    this.stage = new PIXI.Stage(0x000000);
    for (i = 0; i < 5; i++) {
        this.layers[i] = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.layers[i]);
    }
};

render.draw = function() {
    this.render.render(this.stage);
};

module.exports = render;
