define(
    'game/utils',
    [],
    function() {
        var utils = {};

        // p2.js to phaser
        utils.sxp = function(val) {
            return val * 20;
        };

        // Phaser to p2.js
        utils.pxs = function(val) {
            return val / 20;
        };

        return utils;
    }
);