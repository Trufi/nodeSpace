import PIXI from 'pixi.js';

import assets from '../modules/assets';
import render from '../modules/render';
import camera from '../modules/camera';

const layers = [];

export function create() {
    const scale = camera.scale();

    layers[0] = new PIXI.extras.TilingSprite(assets.texture.bg_0,
        render.resolution[0] / scale, render.resolution[1] / scale);
    layers[0].position.x = 0;
    layers[0].position.y = 0;
    layers[0].tilePosition.x = 0;
    layers[0].tilePosition.y = 0;
    render.layers[0].addChild(layers[0]);

    layers[1] = new PIXI.extras.TilingSprite(assets.texture.bg_1,
        render.resolution[0] / scale, render.resolution[1] / scale);
    layers[1].position.x = 0;
    layers[1].position.y = 0;
    layers[1].tilePosition.x = 0;
    layers[1].tilePosition.y = 0;
    render.layers[0].addChild(layers[1]);

    layers[2] = new PIXI.extras.TilingSprite(assets.texture.bg_2,
        render.resolution[0] / scale, render.resolution[1] / scale);
    layers[2].position.x = 0;
    layers[2].position.y = 0;
    layers[2].tilePosition.x = 0;
    layers[2].tilePosition.y = 0;
    layers[2].scale = new PIXI.Point(scale, scale);
    render.layers[0].addChild(layers[2]);

    layers[3] = new PIXI.extras.TilingSprite(assets.texture.bg_3,
        render.resolution[0] / scale, render.resolution[1] / scale);
    layers[3].position.x = 0;
    layers[3].position.y = 0;
    layers[3].tilePosition.x = 0;
    layers[3].tilePosition.y = 0;
    layers[3].scale = new PIXI.Point(scale, scale);
    render.layers[0].addChild(layers[3]);
}

export function update() {
    const cameraPos = camera.position();
    const camSc = camera.scale();
    let bgSc = 0.05;
    let scale = 1 + bgSc * (camSc - 1);

    layers[0].width = render.resolution[0] / scale;
    layers[0].height = render.resolution[1] / scale;
    layers[0].scale.x = scale;
    layers[0].scale.y = scale;
    layers[0].tilePosition.x = render.resolution[0] * (1 / scale - 1) / 2 - cameraPos[0] * bgSc;
    layers[0].tilePosition.y = render.resolution[1] * (1 / scale - 1) / 2 - cameraPos[1] * bgSc;

    bgSc = 0.1;
    scale = 1 + bgSc * (camSc - 1);
    layers[1].width = render.resolution[0] / scale;
    layers[1].height = render.resolution[1] / scale;
    layers[1].scale.x = scale;
    layers[1].scale.y = scale;
    layers[1].tilePosition.x = render.resolution[0] * (1 / scale - 1) / 2 - cameraPos[0] * bgSc;
    layers[1].tilePosition.y = render.resolution[1] * (1 / scale - 1) / 2 - cameraPos[1] * bgSc;

    bgSc = 0.2;
    scale = 1 + bgSc * (camSc - 1);
    layers[2].width = render.resolution[0] / scale;
    layers[2].height = render.resolution[1] / scale;
    layers[2].scale.x = scale;
    layers[2].scale.y = scale;
    layers[2].tilePosition.x = render.resolution[0] * (1 / scale - 1) / 2 - cameraPos[0] * bgSc;
    layers[2].tilePosition.y = render.resolution[1] * (1 / scale - 1) / 2 - cameraPos[1] * bgSc;

    scale = camSc;
    if (scale > 0.47) {
        layers[3].width = render.resolution[0] / scale;
        layers[3].height = render.resolution[1] / scale;
        layers[3].scale.x = scale;
        layers[3].scale.y = scale;
        layers[3].tilePosition.x = render.resolution[0] * (1 / scale - 1) / 2 - cameraPos[0];
        layers[3].tilePosition.y = render.resolution[1] * (1 / scale - 1) / 2 - cameraPos[1];
        layers[3].visible = true;
    } else {
        layers[3].visible = false;
    }
}
