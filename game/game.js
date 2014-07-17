var p2 = require('p2');
var utils = require('./utils');

var Game = function Game() {
    this.id = utils.getId('game');
    this.worldSize = [5000, 5000];
    this.timeStep = 1;
    this.world = new p2.World({
        gravity: [0, 0],
        applyDamping: false
    });
    this.interval = undefined;
    this.users = {};
    this.bodies = {};
};

Game.prototype.start = function() {
    var _this = this;
    this.interval = setInterval(function() {
        _this.world.step(_this.timeStep);
        Game.sendStateToUsers();
    }, 1000 * this.timeStep);
};

Game.prototype.stop = function() {
    clearInterval(this.interval);
};

Game.prototype.sendStateToUsers = function() {
    var i;
    for (i in this.users) {
        socket.emit('updateGameState', this.getGameState());
    }
};

Game.prototype.getGameState = function(user) {
    var state = {};
    var i;

    state.bodies = [];
    for (i in this.bodies) {
        state.bodies.push(this.bodies[i].getInfo());
    }

    state.users = [];
    for (i in this.users) {
        state.users.push(this.users[i].getInfo());
    }

    return state;
};

Game.prototype.addUser = function(user) {
    this.users[user.id] = user;
};

Game.prototype.removeUser = function(user) {
    if (typeof this.users !== 'undefined') {
        delete this.users[user.id];
    }
};

module.exports = Game;