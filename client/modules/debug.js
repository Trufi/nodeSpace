import PIXI from 'pixi.js';

import render from '../modules/render';
import Stats from 'stats.js';
import ping from '../modules/ping';

const fontColor = '#777';

class Debug {
    constructor() {
        this._stats = new Stats();

        this._text = new PIXI.Text('', {
            font: 'normal 14px Arial',
            fill: fontColor
        });
        this._text.position.x = 10;
        this._text.position.y = 10;

        this._container = null;
    }

    addTo(container) {
        container.addChild(this._text);
        this._container = container;
    }

    remove() {
        this._container.removeChild(this._text);
        this._container = null;
    }

    update() {
        this._text.text = 'Ping: ' + ping.get() + 'ms' +
            '\ndt: ' + Math.round(ping.dt() * 1000) / 1000 +
            '\n' + this._stats.getText();
    }

    frameStart() {
        this._stats.start();
    }

    frameEnd() {
        this._stats.end();
    }

    resetStats() {
        this._stats.reset();
    }
}

export default new Debug();
