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
        var User = require('modules/user');
        var key = require('modules/key');
        var player = require('modules/player');
        var ScreenArrow = require('interface/screenArrow');
        var body = require('body/index');

        var game = _.clone(require('./game'));

        game.start = function(options) {
            //this.followBodyNumber = player.user.ship.id;
            this.followBodyNumber = 1;
            this.camera.followTo(this.bodies[this.followBodyNumber]);

            this.scrArrow = new ScreenArrow({
                camera: this.camera,
                target: this.bodies[1],
                stage: this.stage
            });

            this.updateFromServerEnable();
            
            this.loop();
        };

        game.update = function() {
            this.camera.update();

            _(game.bodies).forEach(function(el) {
                el.updateSprite();
            });

            this.updateBackground();

            if (key.pressed.SPACE) {
                this.followBodyNumber = this.followBodyNumber % _.size(this.bodies) + 1;
                this.camera.followTo(this.bodies[this.followBodyNumber]);
            }

            if (key.pressed.WHEELDOWN) {
                this.camera.zoomOut();
            } else if (key.pressed.WHEELUP) {
                this.camera.zoomIn();
            }

            if (key.down.W) {
                player.action('thrust');
            } else if (key.down.S) {
                player.action('reverse');
            }

            if (key.down.A) {
                player.action('left');
            } else if (key.down.D) {
                player.action('right');
            } else if (!key.down.CTRL) {
                // TODO: торможение
            }

            this.scrArrow.update();

            key.reset();
            player.sendActionToServer();
        };

        game.render = function() {

        };

        return game;
    }
);