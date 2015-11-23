import request from '../modules/request';

let ping = {};

let pingTimeInterval = 1000;

let value = 0;
let sendTime = Date.now();

function approxPing(time) {
    value = Math.round((value + time) / 2);
}

let lastDiffs = 0;
let numderOfLastDiffs = 0;

function approxDiffWithServerTime(clientTime, serverTime, dt) {
    let currentDiff = clientTime + dt / 2 - serverTime;
    lastDiffs = (numderOfLastDiffs * lastDiffs + currentDiff) / (numderOfLastDiffs + 1);
    numderOfLastDiffs += 1;
}

function checkPing() {
    sendTime = Date.now();
    request.ping(function(serverTime) {
        let now = Date.now();

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

export {ping as default};
