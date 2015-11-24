import PIXI from 'pixi.js';

import render from '../modules/render';
import ping from '../modules/ping';

let debug = {};

let pingText;
let dtText;

debug.pingOn = function() {
    pingText = new PIXI.Text(ping.get() + 'ms', {
        font: 'normal 18px Arial',
        fill: '#fff'
    });
    pingText.position.x = 10;
    pingText.position.y = 10;
    render.layers[4].addChild(pingText);

    dtText = new PIXI.Text(ping.get() + 'ms', {
        font: 'normal 18px Arial',
        fill: '#fff'
    });
    dtText.position.x = 10;
    dtText.position.y = 40;
    render.layers[4].addChild(dtText);
};

debug.pingOff = function() {
    render.layers[4].removeChild(pingText);
    pingText = undefined;
};

debug.update = function() {
    if (pingText !== undefined) {
        pingText.text = ping.get() + 'ms';
    }
    if (dtText !== undefined) {
        dtText.text = 'dt: ' + (Math.floor(ping.dt() * 1000) / 1000);
    }
};

export {debug as default};
