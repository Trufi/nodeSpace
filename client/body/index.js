import Asteroid from './Asteroid';
import Rectangle from './Rectangle';
import Ship from './ships/Ship';
import Bullet from './bullets/Bullet';

export function create(options = {}) {
    let newBody;

    const type = options.type || 2;

    switch (type) {
        case 1:
            newBody = new Asteroid(options);
            break;
        case 2:
            newBody = new Rectangle(options);
            break;
        case 10:
            newBody = new Ship(options);
            break;
        case 1000:
            newBody = new Bullet(options);
            break;
        default:
            newBody = new Rectangle(options);
    }

    newBody.createBody(options);
    newBody.applyShape();
    newBody.createSprite();
    newBody.applyActions();

    newBody.updateSprite();

    return newBody;
}
