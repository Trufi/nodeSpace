import * as body from '../../body';
import Game from '../Game';

// инициализация единственной пока что игры
const game = new Game();
game.start();

// добавим астероид в игру
const asteroid = body.create({
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
    type: 2,
    position: [10, 1000],
    velocity: [50, -150],
    angularVelocity: 0.5,
    mass: 5
}));

export {game as default};
