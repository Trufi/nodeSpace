var _ = require('lodash');
var Game = require('game/game');
var User = require('game/user');
var body = require('game/body/index');

// инициализация единственной пока что игры
var game = new Game();
game.start();

// добавим астероид в игру
var asteroid = body.create({
    type: 1,
    position: [0, 0],
    velocity: [0, 0],
    angularVelocity: 0.53
});

game.addBody(asteroid);

game.addBody(body.create({
    type: 1,
    position: [500, 10],
    velocity: [0, 0],
    angularVelocity: -0.1
}));

game.addBody(body.create({
    type: 0,
    position: [10, 1000],
    velocity: [50, -150],
    angularVelocity: 0.5,
    mass: 5
}));

module.exports = game;