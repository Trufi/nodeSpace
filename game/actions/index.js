var Thrust = require('./thrust');

exports.create = function(options) {
    var newAction;

    switch (options.name) {
        case 'thrust':
            newAction = new Thrust(options);
            break;
    }

    return newAction;
};