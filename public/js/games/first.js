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
        var player = require('modules/player');

        var game = _.clone(require('./game'));

        game.start = function(options) {
            var _this = this;

            this.world = new p2.World({
                gravity: options.world.gravity,
                applyDamping: options.world.applyDamping
            });

            this.stage = new PIXI.Stage(0x000000);

            // создаем камеру
            this.camera = camera.create(render.resolution[0], render.resolution[1]);
            camera.set(this.camera);

            // создаем фон
            this.createBackground(assets.texture.background);

            // создаем объекты в космосе
            _(options.bodies).forEach(function(el) {
                _this.addBody(body.create(el));
            });

            // создаем и сохраняем юзеров
            _(options.users).forEach(function(el) {
                var user = new User(el);
                _this.addUser(user);
                user.setShip(_this.bodies[el.shipId]);
            });

            // присваиваем User игроку
            player.setUser(this.users[options.player.id]);

            this.followBodyNumber = player.user.ship.id;
            this.camera.followToBody(this.bodies[this.followBodyNumber]);

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
                this.camera.followToBody(this.bodies[this.followBodyNumber]);
            }

            if (key.pressed.WHEELDOWN) {
                this.camera.zoomOut();
            } else if (key.pressed.WHEELUP) {
                this.camera.zoomIn();
            }

            if (key.down.W) {
                player.action('thrust');
            }

            key.reset();
            player.sendActionToServer();
        };

        game.render = function() {

        };

        return game;
    }
);