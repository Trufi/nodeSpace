define(
    'game/assets',
    ['json!config', 'pixi'],
    function(config, PIXI) {
        var assets = {};

        assets.texture = {};

        assets.load = function (loadObj, callback) {
            var loadArray = [],
                loader, i, src;

            // загрузка текстур
            for (i in loadObj.texture) {
                src = config.pathToAssets + loadObj.texture[i];
                loadArray.push(src);
            }

            loader = new PIXI.AssetLoader(loadArray);

            loader.onComplete = function() {
                var i;

                for (i in loadObj.texture) {
                    assets.texture[i] = new PIXI.Texture.fromImage(config.pathToAssets + loadObj.texture[i]);
                }

                callback();
            };
            loader.load();
        };

        return assets;
    }
);