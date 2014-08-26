define(
    function(require) {
        var request = require('modules/request');

        var ping = {};

        var pingTimeInterval = 1000;

        var value = 0;
        var sendTime = Date.now();

        function approxPing(time) {
            value = (value + time) / 2;
        }

        function checkPing() {
            sendTime = Date.now();
            request.ping(function() {
                approxPing(Date.now() - sendTime);
                setTimeout(checkPing, pingTimeInterval);
            });
        }


        ping.on = function() {
            checkPing();
        };

        ping.get = function() {
            return Math.floor(value);
        };

        return ping;
    }
);