define(
    'game/body',
    ['p2', 'json!game/shapes.json', 'game/game', 'game/utils'],
    function(p2, shapes, game, utils) {
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

            this.sprite = undefined;
        };

        Body.prototype.createSprite = function() {
            this.sprite = game.phaserGame.add.sprite(utils.sxp(this.body.position[0]), utils.sxp(this.body.position[1]), 'asteroid2');
            this.sprite.anchor.setTo(0.5, 0.5);
            this.sprite.angle = this.body.angle; // TODO: dfh
        };

        Body.prototype.addToWorld = function() {
            game.world.addBody(this.body);
            this.createSprite();
        };

        Body.prototype.updateSprite = function() {
            this.sprite.x = utils.sxp(this.body.position[0]);
            this.sprite.y = utils.sxp(this.body.position[1]);
            this.sprite.angle = this.body.angle;
        };

        return Body;
    }
);

