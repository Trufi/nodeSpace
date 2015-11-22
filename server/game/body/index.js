import Asteroid from './Asteroid';
import Rectangle from './Rectangle';
import Ship from './ships/Ship';
import Bullet from './bullets/Bullet';

let idCounter = 1;

export function create(options = {}) {
    let newBody;

    options.type = options.type || 2;
    options.id = idCounter++;

    switch (options.type) {
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
    newBody.applyActions();

    return newBody;
}

export function collide(a, b) {
    b.damage(a);
    a.damage(b);
}

export function beginContact(a, b) {
    if (a instanceof Bullet) {
        b.damage(a);
    }

    if (b instanceof Bullet) {
        a.damage(b);
    }
}
