define(
    'game/body',
    ['p2', 'pixi', 'json!game/shapes.json', 'game/game', 'game/utils'],
    function(p2, PIXI, shapes, game, utils) {
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

            this.sprite = new PIXI.Sprite.fromImage(game.assets.asteroid);
            this.sprite.position.x = utils.sxp(this.body.position[0]);
            this.sprite.position.y = utils.sxp(this.body.position[1]);
        };

        Body.prototype.addToWorld = function() {
            game.world.addBody(this.body);
            game.stage.addChild(this.sprite);
        };

        Body.prototype.updateSprite = function() {
            // TODO: this.sprite.angle = this.body.angle;
            this.sprite.position.x = utils.sxp(this.body.position[0]);
            this.sprite.position.y = utils.sxp(this.body.position[1]);
        };

        return Body;
    }
);

