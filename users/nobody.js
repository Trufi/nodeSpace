var game = require('game');
var clientConnect = require('modules/clientconnect');

function Nobody(options) {
    this.id = options.id;
    this.socket = options.socket;
    this.game = game.getGameForNobody();
}

Nobody.prototype.sendFirstState = function() {
    var state = {};

    state.game = this.game.getGameFirstState();
    state.user = {
        type: 0
    };

    this.socket.emit('userFirstState', state);
};

Nobody.prototype.send = function(name, data) {
    this.socket.emit(name, data);
};

module.exports = Nobody;