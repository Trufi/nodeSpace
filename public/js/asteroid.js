function createAsteroid(position) {
    var asteroid = game.add.sprite(position[0], position[1], 'asteroid');

    asteroid.anchor.setTo(0.5, 0.5);
    game.physics.p2.enable(asteroid);
    asteroid.body.setCircle(87);
    asteroid.body.mass = 100;
    asteroid.body.rotation = Math.random() * Math.PI;


    asteroid.body.angularVelocity = (Math.random() - 0.5) / 2;
    asteroid.body.data.velocity[0] = (Math.random() - 0.5) * 2;
    asteroid.body.data.velocity[1] = (Math.random() - 0.5) * 2;

    return asteroid;
}

function createAsteroid2 (position) {
    var asteroid = game.add.sprite(position[0], position[1], 'asteroid2');

    asteroid.anchor.setTo(0.5, 0.5);
    game.physics.p2.enable(asteroid);
    asteroid.body.clearShapes();
    asteroid.body.loadPolygon('physicsData', 'asteroid');
    asteroid.body.mass = 50;
    asteroid.body.rotation = Math.random() * Math.PI;


    asteroid.body.angularVelocity = (Math.random() - 0.5) / 5;
    asteroid.body.data.velocity[0] = (Math.random() - 0.5) * 15;
    asteroid.body.data.velocity[1] = (Math.random() - 0.5) * 15;

    return asteroid;
}
