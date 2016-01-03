import request from '../modules/request';
import time from '../modules/time';
import config from '../config.json';

let ping = {};

let pingTimeInterval = 1000;

let value = 0;
let sendTime = time();

function approxPing(time) {
    value = Math.round((value + time) / 2);
}

let lastDiffs = 0;
let numderOfLastDiffs = 0;
let readyToUse = false;

function approxDiffWithServerTime(clientTime, serverTime, dt) {
    const currentDiff = clientTime + dt / 2 - serverTime;
    const newlastDiffs = (numderOfLastDiffs * lastDiffs + currentDiff) / (numderOfLastDiffs + 1);

    if (!readyToUse && Math.abs(newlastDiffs - lastDiffs) < config.pingStableTime) {
        readyToUse = true;
    }

    lastDiffs = newlastDiffs;
    numderOfLastDiffs += 1;
}

function checkPing() {
    sendTime = time();
    request.ping(function(serverTime) {
        let now = time();

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

ping.reset = function() {
    lastDiffs = 0;
    numderOfLastDiffs = 0;
    value = 0;
    readyToUse = false;
};

ping.readyToUse = function() {
    return readyToUse;
};

export {ping as default};
