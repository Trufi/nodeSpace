var Asteroid = require('./asteroid');
var Rectangle = require('./rectangle');
var Ship = require('./ships/ship');
var Bullet = require('./bullets/bullet');

var idCounter = 1;

exports.create = function(options) {
    var newBody;

    options = options || {};
    options.type = options.type || 2;
    options.id = idCounter++;

    switch (options.type) {
        case 1:
            newBody = new Asteroid(options);
            break;
        case 2:
            newBody = new Rectangle(options);
            break;
        case 10:
            newBody = new Ship(options);
            break;
        case 1000:
            newBody = new Bullet(options);
            break;
        default:
            newBody = new Rectangle(options);
    }

    newBody.createBody(options);
    newBody.applyShape();
    newBody.applyActions();

    return newBody;
};

exports.collide = function(a, b) {
    b.damage(a);
    a.damage(b);
};

exports.beginContact = function(a, b) {
    if (a instanceof Bullet) {
        b.damage(a);
    }

    if (b instanceof Bullet) {
        a.damage(b);
    }
};