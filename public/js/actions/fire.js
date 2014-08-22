define(
    function(require) {
        var utils = require('utils');
        var Action = require('./action');

        var Fire = function Fire(options) {
            Fire.super_.apply(this, arguments);

            this.cooldown = 50;
            this.ship = options.body;
        };

        utils.inherits(Fire, Action);

        return Fire;
    }
);