var Move = require('./move');
var Fire = require('./fire');

exports.create = function(options) {
    var newAction;

    switch (options.name) {
        case 1:
            newAction = new Move(options);
            break;
        case 2:
            newAction = new Move(options);
            break;
        case 3:
            newAction = new Move(options);
            break;
        case 4:
            newAction = new Move(options);
            break;
        case 5:
            newAction = new Fire(options);
            break;
    }

    return newAction;
};