window.Body = (function(p2, world) {
    function Body(param) {
        this.type = param.type;

        this.body = new p2.Body({
            mass: param.mass,
            position: param.position,
            velocity: param.velocity,
            angularVelocity: param.angularVelocity,
            angularDamping: 0
        });

        this.enable();
    }

    Body.prototype.enable = function() {
        world.addBody(this.body);
    };

    return Body;
})(p2, physics.world);