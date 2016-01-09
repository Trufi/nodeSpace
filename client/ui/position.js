import render from '../modules/render';

const position = {};
position.CENTER = [0, 0];
position.TOP = [0, 0];
position.BOTTOM = [0, 0];
position.LEFT = [0, 0];
position.RIGHT = [0, 0];
position.TOPLEFT = [0, 0];
position.TOPRIGHT = [0, 0];
position.BOTTOMLEFT = [0, 0];
position.BOTTOMRIGHT = [0, 0];

position.update = function() {
    this.CENTER = [render.resolution[0] / 2, render.resolution[1] / 2];

    this.TOP = [render.resolution[0] / 2, 0];
    this.BOTTOM = [render.resolution[0] / 2, render.resolution[1]];
    this.LEFT = [0, render.resolution[1] / 2];
    this.RIGHT = [render.resolution[0], render.resolution[1] / 2];

    this.TOPLEFT = [0, 0];
    this.TOPRIGHT = [render.resolution[0], 0];
    this.BOTTOMLEFT = [0, render.resolution[1]];
    this.BOTTOMRIGHT = [render.resolution[0], render.resolution[1]];
};

export {position as default};
