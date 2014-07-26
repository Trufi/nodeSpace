// Первая игра
define(
    function(require) {
        var p2 = require('p2');
        var PIXI = require('pixi');
        var _ = require('lodash');
        var camera = require('modules/camera');
        var render = require('modules/render');
        var assets = require('modules/assets');
        var request = require('modules/request');
        var body = require('body/index');
        var User = require('modules/user');
        var key = require('modules/key');

        var game = _.clone(require('./game'));

        game.start = function(options) {
            var _this = this;

            this.world = new p2.World({
                gravity: options.world.gravity,
                applyDamping: options.world.applyDamping
            });

            this.stage = new PIXI.Stage(0x000000);

            this.camera = camera.create(render.resolution[0], render.resolution[1]);
            camera.set(this.camera);

            this.createBackground(assets.texture.background);

            _(options.bodies).forEach(function(el) {
                _this.addBody(body.create(el));
            });

            this.followBodyNumber = 3;
            this.camera.followToBody(this.bodies[this.followBodyNumber]);

/*            _(options.users).forEach(function(el) {
                _this.addUser(new User(el));
            });*/

            this.updateFromServerEnable();
            
            this.loop();
        };

        game.update = function() {
            this.camera.update();

            _(game.bodies).forEach(function(el) {
                el.updateSprite();
            });

            this.background.tilePosition.x = this.camera.x(0);
            this.background.tilePosition.y = this.camera.y(0);

            if (key.press.SPACE) {
                this.followBodyNumber = this.followBodyNumber % 3 + 1;
                this.camera.followToBody(this.bodies[this.followBodyNumber]);
            }

            key.reset();
        };

        game.render = function() {

        };

        return game;
    }
);