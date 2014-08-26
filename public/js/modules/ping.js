define(
    function(require) {
        var _ = require('lodash');
        var request = require('modules/request');

        var ping = {};

        var pingTimeInterval = 1000;

        var value = 0;
        var sendTime = Date.now();

        function approxPing(time) {
            value = Math.round((value + time) / 2);
        }

        var lastDiffs = [];
        var diffWithServer = 0;
        function approxDiffWithServerTime(clientTime, serverTime, dt) {
            var sum = 0,
                length = lastDiffs.length,
                currentDiff = clientTime + dt / 2 - serverTime,
                diff;

            _(lastDiffs).forEach(function(el) {
                sum += el;
            });
            diff = Math.round((sum + currentDiff) / (length + 1));
            lastDiffs.push(currentDiff);

            lastDiffs = lastDiffs.slice(-10);
            diffWithServer = diff;
        }

        function checkPing() {
            sendTime = Date.now();
            request.ping(function(serverTime) {
                var now = Date.now();

                approxPing(now - sendTime);
                approxDiffWithServerTime(sendTime, serverTime, now - sendTime);
                setTimeout(checkPing, pingTimeInterval);
            });
        }


        ping.on = function() {
            checkPing();
        };

        ping.get = function() {
            return value;
        };

        ping.dt = function() {
            return diffWithServer;
        };

        return ping;
    }
);