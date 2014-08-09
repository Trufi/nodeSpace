define(
    function(require) {
        var interface = {};

        interface.frame = require('./frame');
        interface.button = require('./button');
        interface.editbox = require('./editbox');

        return interface;
    }
);