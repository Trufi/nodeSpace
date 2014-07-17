var utils = {};

var ids = {};
utils.getId = function(name) {
    if (typeof ids[name] === 'undefined') {
        ids[name] = 0;
    }
    return ids[name]++;
};

module.exports = utils;