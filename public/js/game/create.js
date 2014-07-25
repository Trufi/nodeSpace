define(
    function(require) {
        var _ = require('lodash');
        var game = require('game/game');
        var body = require('./body/index');
        var assets = require('game/assets');
        var camera = require('game/camera');

        return function(data) {
            game.setBackground(assets.texture.background);
            camera.set(camera.create(game.resolution[0], game.resolution[1]));

            _(data.bodies).forEach(function(el) {
                game.addBody(body.create(el));
            });

            camera.get().followToBody(game.bodies[3]);
        };
    }
);