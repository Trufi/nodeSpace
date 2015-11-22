var first = require('./games/first');
var log = require('../modules/log')(module);

var game = {};

game.list = {
    0: first
};

game.getGameForSpectator = function() {
    return first;
};

game.getGameForPlayer = function(player) {
    return first;
};

game.closeAll = function(req, res) {
    first.close();

    log.info('All games shutdown!');
    res.send('All games shutdown!');
};

module.exports = game;
