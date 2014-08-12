var winston = require('winston');
var config = require('config');

function createLogger(path) {
    var transports = [
        new winston.transports.Console({
            //timestamp: true,
            colorize: true,
            level: 'silly',
            label: path.replace(config['pathToProject'], '')
        })
    ];

    return new winston.Logger({transports: transports});
}

module.exports = function(module) {
    return createLogger(module.filename);
};

