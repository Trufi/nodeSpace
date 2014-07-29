define(
    function(require) {
        var Asteroid = require('./asteroid');
        var Rectangle = require('./rectangle');
        var Ship = require('./ships/ship');
        var exports = {};

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
                case 10:
                    newBody = new Ship(options);
                    break;
            }

            newBody.applyActions();
            newBody.createBody(options);
            newBody.applyShape();
            newBody.createSprite();
            newBody.updateSprite();

            return newBody;
        };

        return exports;
    }
);