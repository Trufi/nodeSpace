var game = require('/game');

function Spectator(options) {
    this.id = options.id;
    this.socket = options.socket;
    this.sid = options.sid;
    this.game = game.spectatorGame();
}