window.physics = (function(p2) {
    var physics = {};

    var world = new p2.World({
        gravity: [0, 0],
        applyDamping: false
    });

    physics.world = world;

    return physics;
})(p2);

