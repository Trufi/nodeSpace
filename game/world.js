var p2 = require('p2');

var world = new p2.World({
    gravity: [0, 0],
    applyDamping: false
});

var worldSize = [5000, 5000];

var step = function(duration) {
    world.step(duration);
};

exports.world = world;
exports.worldSize = worldSize;
exports.step = step;