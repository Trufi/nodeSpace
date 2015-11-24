import PIXI from 'pixi.js';

import config from '../config';

let text = {};

class Text {
    constructor(options = {}) {
        this.id;
        this.text = options.text || '';
        this.width = options.width || 300;
        this.position = options.position || [0, 0];
        this.fontSize = options.fontSize || 22;
        this.textAlign = options.textAlign || 'left';
        this.color = options.color || 'fff';
        this.anchor = options.anchor || [0, 0];

        this.displayObject = new PIXI.Text(this.text, {
            font: config.buttonFontWeight + ' ' + this.fontSize + 'px ' + config.buttonFontFamily,
            align: this.textAlign,
            fill: '#' + this.color,
            wordWrap: true,
            wordWrapWidth: this.width
        });
        this.displayObject.position.x = this.position[0];
        this.displayObject.position.y = this.position[1];
        this.displayObject.anchor.x = this.anchor[0];
        this.displayObject.anchor.y = this.anchor[1];

        if (options.visible !== undefined) {
            this.displayObject.visible = options.visible;
        }
    }


    setText(str) {
        this.text = str;
        this.displayObject.text = str;
    }
}

text.create = function(options) {
    return new Text(options);
};

export {text as default};
