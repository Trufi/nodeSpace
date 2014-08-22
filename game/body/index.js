var Asteroid = require('./asteroid');
var Rectangle = require('./rectangle');
var Ship = require('./ships/ship');
var Bullet = require('./bullets/bullet');

var idCounter = 0;

exports.create = function(options) {
    var newBody;

    options = options || {};
    options.type = options.type || 0;
    options.id = ++ idCounter;

    switch (options.type) {
        case 0:
            newBody = new Rectangle(options);
            break;
        case 1:
            newBody = new Asteroid(options);
            break;
        case 10:
            newBody = new Ship(options);
            break;
        case 1000:
            newBody = new Bullet(options);
            break;
    }

    newBody.applyActions();
    newBody.createBody(options);
    newBody.applyShape();

    return newBody;
};