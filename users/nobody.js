var game = require('game');

function Nobody(options) {
    this.id = options.id;
    this.socket = options.socket;
    this.game = game.getGameForNobody();
}

Nobody.prototype.sendGameFirstState = function() {
    this.socket.emit('firstGameState', this.game.getGameFirstState());
};

Nobody.prototype.send = function(name, data) {
    this.socket.emit(name, data);
};

module.exports = Nobody;