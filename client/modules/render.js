import PIXI from 'pixi.js';;

import config from '../config';

let render = {};

// stage из pixi.js
render.stage;
// уровни в stage
render.layers = [];

render.create = function(options = {}) {
    let gameWrap = document.getElementById(config.gameHtmlWrapId);

    // разрешение рендера
    this.resolution = options.resolution || [window.innerWidth, window.innerHeight];

    this.render = PIXI.autoDetectRenderer(this.resolution[0], this.resolution[1], {
        antialias: true
    });
    this.render.view.style.display = 'block';

    document.getElementById('gamepreloader').style.display = 'none';
    gameWrap.style.display = 'block';
    gameWrap.appendChild(this.render.view);

    this.stage = new PIXI.Container();

    for (let i = 0; i < 5; i++) {
        this.layers[i] = new PIXI.Container();
        this.stage.addChild(this.layers[i]);
    }
};

render.draw = function() {
    this.render.render(this.stage);
};

export {render as default};
