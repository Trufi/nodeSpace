var first = require('./games/first');

var game = {};

game.getGameForSpectator = function() {
    return first;
};

game.getGameForPlayer = function(player) {
    return first;
};

module.exports = game;