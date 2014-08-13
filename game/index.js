var first = require('./games/first');

var game = {};

game.getGameForNobody = function() {
    return first;
};

game.getGameForPlayer = function(player) {
    return first;
};

module.exports = game;