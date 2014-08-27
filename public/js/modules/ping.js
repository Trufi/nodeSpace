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

        var lastDiffs = 0;
        var numderOfLastDiffs = 0;
        function approxDiffWithServerTime(clientTime, serverTime, dt) {
            var currentDiff = clientTime + dt / 2 - serverTime;
            lastDiffs = (numderOfLastDiffs * lastDiffs + currentDiff) / (numderOfLastDiffs + 1);
            numderOfLastDiffs += 1;
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
            return lastDiffs;
        };

        return ping;
    }
);