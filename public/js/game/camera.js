define(
    'game/camera',
    [],
    function() {
        var camera = {};

        var Camera = function Camera(width, height, scale) {
            //this.width = width || 1024;
            //this.height = height || 768;
            this.scale = scale || 20;

            this.position = [0, 0];
            //this.angle = 0; пока без поворотов

            this.followFunction = function() {
                return [0, 0];
            };
        };

        Camera.prototype.followToBody = function(body) {
            this.followFunction = (function() {
                return function() {
                    return [body.body.position[0], body.body.position[1]];
                };
            })();
        };

        Camera.prototype.update = function() {
            this.position = this.followFunction();
        };

        Camera.prototype.x = function(val) {
            return (val - this.position[0]) * this.scale;
        };

        Camera.prototype.y = function(val) {
            return (val - this.position[1]) * this.scale;
        };

        var enableCamera = new Camera();

        camera.create = function(width, height, scale) {
            return new Camera(width, height, scale);
        };

        camera.set = function(cam) {
            cam.update();
            enableCamera = cam;
        };

        camera.get = function() {
            return enableCamera;
        };

        // get object position through camera
        camera.x = function(val) {
            return enableCamera.x(val);
        };
        camera.y = function(val) {
            return enableCamera.y(val);
        };

        camera.update = function() {
            enableCamera.update();
        };

        return camera;
    }
);