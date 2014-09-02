define(
    function(require) {
        var Asteroid = require('./asteroid');
        var Rectangle = require('./rectangle');
        var Ship = require('./ships/ship');
        var Bullet = require('./bullets/bullet');

        var exports = {};

        exports.create = function(options) {
            var newBody, type;

            options = options || [];
            type = options[1] || 2;

            switch (type) {
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
            newBody.createSprite();
            newBody.applyActions();

            newBody.updateSprite();

            return newBody;
        };

        return exports;
    }
);