import util from 'util';
import p2 from 'p2';

import Body from './Body';

export default function Rectangle(options) {
    Rectangle.super_.apply(this, arguments);
}

util.inherits(Rectangle, Body);

Rectangle.prototype.applyShape = function() {
    this.body.addShape(new p2.Rectangle(100, 100));
};
