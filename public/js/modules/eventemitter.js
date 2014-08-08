define(
    function(require) {
        var eventEmitter = {};

        var events = {};

        eventEmitter.on = function(type, callback) {
            if (events[type] === undefined) {
                events[type] = {
                    callbacks: [],
                    once: []
                };
            }

            events[type].callbacks.push(callback);
            events[type].once = false;
        };

        eventEmitter.once = function(type, callback) {
            if (events[type] === undefined) {
                events[type] = {
                    callbacks: [],
                    once: []
                };
            }

            events[type].callbacks.push(callback);
            events[type].once = true;
        };

        eventEmitter.emit = function(type, data) {
            var i, max;

            if (events[type] !== undefined) {
                for (i = 0, max = events[type].length; i < max; i++) {
                    events[type][i].callback(data);

                    if (events[type][i].once) {
                        events[type].callbacks.splice(i, 1);
                        events[type].once.splice(i, 1);
                        i--;
                    }
                }
            }
        };

        eventEmitter.removeListener = function(type, callback) {
            var i;
            if (events[type] !== undefined) {
                i = events[type].indexOf(callback);

                if (i !== -1) {
                    events[type].callbacks.splice(i, 1);
                    events[type].once.splice(i, 1);
                }
            }
        };
    }
);

