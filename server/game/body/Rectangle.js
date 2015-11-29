import p2 from 'p2';

import Body from './Body';

export default class Rectangle extends Body {
    constructor(options) {
        super(options);
    }

    applyShape() {
        this.body.addShape(new p2.Box({width: 100, height: 100}));
    }
}
