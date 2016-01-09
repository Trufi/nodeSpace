import PIXI from 'pixi.js';
import _ from 'lodash';

import config from '../config';

const assets = {};

assets.texture = {};

assets.load = function(loadObj, callback) {
    const loader = PIXI.loader;

    loadObj.texture.screenArrow = 'screenarrow.png';
    loadObj.texture.debug = 'debug.png';

    if (window.JS_ENV === 'production') {
        loadObj.texture.cameraDebug = 'debug.png';
        loadObj.texture.cameraDebugGreen = 'debug.png';
        loadObj.texture.cameraDebugYellow = 'debug.png';
    } else {
        loadObj.texture.cameraDebug = 'camera_debug.png';
        loadObj.texture.cameraDebugGreen = 'camera_debug_green.png';
        loadObj.texture.cameraDebugYellow = 'camera_debug_yellow.png';
    }

    loadObj.texture.bg_0 = 'bg_0.png';
    loadObj.texture.bg_1 = 'bg_1.png';
    loadObj.texture.bg_2 = 'bg_2.png';
    loadObj.texture.bg_3 = 'bg_3.png';

    loadObj.texture.aimRed = 'aim_red.png';
    // loadObj.texture.aimBlue = 'aim_blue.png';

    loadObj.texture.bulletGreen = 'bullet_green.gif';

    // загрузка текстур
    _.forEach(loadObj.texture, (texturePath, name) => {
        loader.add(name, config.pathToAssets + texturePath);
    });

    loader.load((loader, resources) => {
        _.forEach(resources, (resource, name) => {
            assets.texture[name] = resource.texture;
        });

        generateGraphicsTextures();

        callback();
    });
};

function generateThrustTextures() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(0, 0, 5, 30);
    graphics.endFill();
    return graphics.generateTexture();
}

function generateSideTextures() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(0, 0, 10, 5);
    graphics.endFill();
    return graphics.generateTexture();
}

function generateGraphicsTextures() {
    assets.texture.thrust = generateThrustTextures();
    assets.texture.side = generateSideTextures();
}

export {assets as default};
