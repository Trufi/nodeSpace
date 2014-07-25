var Asteroid = require('./asteroid');
var Rectangle = require('./rectangle');

exports.create = function(options) {
    var newBody;

    options = options || {};
    options.type = options.type || 0;

    switch (options.type) {
        case 0:
            newBody = new Rectangle(options);
            break;
        case 1:
            newBody = new Asteroid(options);
            break;
    }

    newBody.createBody(options);
    newBody.applyShape();

    return newBody;
};