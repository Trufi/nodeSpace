define(
    function(require) {
        var interface = {};

        interface.button = require('./button');
        interface.editbox = require('./editbox');

        return interface;
    }
);