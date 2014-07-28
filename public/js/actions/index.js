define(
    function(require) {
        var Move = require('./move');

        var module = {};

        module.create = function(options) {
            var newAction;

            switch (options.name) {
                case 'thrust':
                    newAction = new Move(options);
                    break;
                case 'reverse':
                    newAction = new Move(options);
                    break;
                case 'left':
                    newAction = new Move(options);
                    break;
                case 'right':
                    newAction = new Move(options);
                    break;
            }

            return newAction;
        };

        return module;
    }
);