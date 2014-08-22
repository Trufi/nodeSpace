var Move = require('./move');
var Fire = require('./fire');

exports.create = function(options) {
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
        case 'fire':
            newAction = new Fire(options);
            break;
    }

    return newAction;
};