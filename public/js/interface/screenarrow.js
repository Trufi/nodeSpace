define(
    function(require) {
        var PIXI = require('pixi');
        var assets = require('modules/assets');
        var Body = require('body/body');

        var Arrow = function Arrow(options) {
            this.padding = 30;
            this.target;
            this.typeTarget;
            this.sprite;
            this.camera;
            this.stage = options.stage;

            this.setCamera(options.camera);
            this.followTo(options.target);
            this.createSprite();
        };

        Arrow.prototype.followTo = function(target) {
            if (target instanceof Body) {
                this.typeTarget = 0;
                this.target = target;
            }
        };

        Arrow.prototype.getTargetPosition = function() {
            switch (this.typeTarget) {
                case 0:
                    // Body
                    return [this.target.body.position[0], this.target.body.position[1]];
                default:
                    return [0, 0];
            };
        };

        Arrow.prototype.createSprite = function() {
            this.sprite = new PIXI.Sprite(assets.texture.screenArrow);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.stage.addChild(this.sprite);
        };

        Arrow.prototype.setCamera = function(camera) {
            this.camera = camera;
            this.cameraCornerAngle = [];
            this.cameraCornerAngle[1] = Math.atan2(this.camera.height, this.camera.width);
            this.cameraCornerAngle[0] = Math.atan2(this.camera.height, -this.camera.width);
            this.cameraCornerAngle[2] = -this.cameraCornerAngle[0];
            this.cameraCornerAngle[3] = -this.cameraCornerAngle[1];
        };

        Arrow.prototype.getSpritePosition = function() {
            var targetPos = this.getTargetPosition(),
                cameraPos = this.camera.position,
                angle = -Math.atan2(targetPos[1] - cameraPos[1], targetPos[0] - cameraPos[0]),
                spritePos = [];

            if (angle > this.cameraCornerAngle[3] && angle <= this.cameraCornerAngle[1]) {
                spritePos[0] = this.camera.width - this.padding;
                spritePos[1] = this.camera.height / 2 - (this.camera.width / 2 - this.padding) * Math.tan(angle);
            } else if (angle > this.cameraCornerAngle[1] && angle <= this.cameraCornerAngle[0]) {
                spritePos[1] = this.padding;
                spritePos[0] = this.camera.width / 2 + (this.camera.height / 2 - this.padding) / Math.tan(angle);
            } else if ((angle > this.cameraCornerAngle[0] && angle <= Math.PI) || (angle <= this.cameraCornerAngle[2] && angle > -Math.PI)) {
                spritePos[0] = this.padding;
                spritePos[1] = this.camera.height / 2 + (this.camera.width / 2 - this.padding) * Math.tan(angle);
            } else if (angle > this.cameraCornerAngle[2] && angle <= this.cameraCornerAngle[3]) {
                spritePos[1] = this.camera.height - this.padding;
                spritePos[0] = this.camera.width / 2 - (this.camera.height / 2 - this.padding) / Math.tan(angle);
            }

            return {
                position: spritePos,
                angle: -angle
            };
        };

        Arrow.prototype.update = function() {
            var spr = this.getSpritePosition();

            this.sprite.position.x = spr.position[0];
            this.sprite.position.y = spr.position[1];
            this.sprite.rotation = spr.angle;
        };

        return Arrow;
    }
);