define(
    function() {
        var utils = {};

        // взято из node.js
        utils.inherits = function(ctor, superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        };

        utils.resetAngle = function(angle) {
            return angle - Math.PI * 2 * Math.floor(angle / (Math.PI * 2));
        };

        return utils;
    }
);