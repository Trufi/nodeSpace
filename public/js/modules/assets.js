define(
    function(require) {
        var config = require('json!config');
        var PIXI = require('pixi');

        var assets = {};

        assets.texture = {};

        assets.load = function (loadObj, callback) {
            var loadArray = [],
                loader;

            // загрузка текстур
            _(loadObj.texture).forEach(function(el) {
                loadArray.push(config.pathToAssets + el);
            });

            loader = new PIXI.AssetLoader(loadArray);

            loader.onComplete = function() {
                _(loadObj.texture).forEach(function(el, i) {
                    assets.texture[i] = PIXI.Texture.fromImage(config.pathToAssets + el);
                });

                callback();
            };

            loader.load();
        };

        return assets;
    }
);