define(
    function(require) {
        var PIXI = require('pixi');

        var camera = {};

        var Camera = function Camera(width, height, scale) {
            this.id = ++Camera._idCounter;
            this.width = width || 500;
            this.height = height || 500;
            this.scale = scale || 1;

            this.position = [0, 0];
            //this.angle = 0; пока без поворотов

            // значение на которое меняется scale при зуме
            this.zoomChangeValue = 0.1;

            this.followFunction = function() {
                return [0, 0];
            };

            this.rectangle = new PIXI.Rectangle(0, 0, this.width, this.height);
        };

        Camera._idCounter = 0;

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
            return (val - this.position[0]) * this.scale + this.width / 2;
        };

        Camera.prototype.y = function(val) {
            return (val - this.position[1]) * this.scale + this.height / 2;
        };

        Camera.prototype.zoomOut = function() {
            if (this.scale >= 0.3) {
                this.scale -= this.zoomChangeValue;
            }
        };
        Camera.prototype.zoomIn = function() {
            if (this.scale <= 1.5) {
                this.scale += this.zoomChangeValue;
            }
        };

        Camera.prototype.containsSprite = function(sprite) {
            var bounds = sprite.getBounds();

            if (this.rectangle.contains(bounds.x, bounds.y)) {
                return true;
            } else if (this.rectangle.contains(bounds.x + bounds.width, bounds.y)) {
                return true;
            } else if (this.rectangle.contains(bounds.x, bounds.y + bounds.height)) {
                return true;
            } else if (this.rectangle.contains(bounds.x + bounds.width, bounds.y + bounds.height)) {
                return true;
            } else {
                return false;
            }
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

        camera.scale = function() {
            return enableCamera.scale;
        };

        return camera;
    }
);