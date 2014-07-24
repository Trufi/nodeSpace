define(
    'body/body',
    ['p2', 'pixi', 'json!game/shapes.json', 'game/game', 'game/camera', 'game/assets', 'game/utils'],
    function(p2, PIXI, shapes, game, camera, assets, utils) {
        var body = {};

        // Класс простейшего тела
        var Body = function Body(param) {
            this.id = param.id;
            this.type = param.type; // тип тела 0 - астероид
            this.shape = shapes.asteroid;

            this.body = new p2.Body({
                mass: param.mass,
                position: param.position,
                velocity: param.velocity,
                damping: 0,
                angularVelocity: param.angularVelocity,
                angularDamping: 0,
                angle: param.angle
            });
            this.body.addShape(new p2.Circle(87.5));

            this.sprite = new PIXI.Sprite(assets.texture.asteroid);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;

            this.updateSprite();
            this.testPar = 'testPar';
        };

        Body.prototype.addToWorld = function() {
            game.world.addBody(this.body);
            game.stage.addChild(this.sprite);
        };

        Body.prototype.updateSprite = function() {
            this.sprite.position.x = camera.x(this.body.position[0]);
            this.sprite.position.y = camera.y(this.body.position[1]);
            this.sprite.rotation = this.body.angle;
            this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());
        };

        var Asteroid = function Asteroid() {
            Asteroid.super_.apply(this, arguments);
            this.test = 'ASDASDAS TEST';
        };

        utils.inherits(Asteroid, Body);

        body.create = function(param) {
            return new Body(param);
        };

        return body;
    }
);