define(
    'game/utils',
    [],
    function() {
        var utils = {};

        // Server p2.js to phaser p2.js
        utils.sxp = function(val) {
            return -val;
        };

        // Phaser p2.js to server p2.js
        utils.pxs = function(val) {
            return -val;
        };
    }
);