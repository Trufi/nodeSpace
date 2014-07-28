define(
    function(require) {
        var Thrust = require('./thrust');

        var module = {};

        module.create = function(options) {
            var newAction;

            switch (options.name) {
                case 'thrust':
                    newAction = new Thrust(options);
                    break;
            }

            return newAction;
        };

        return module;
    }
);