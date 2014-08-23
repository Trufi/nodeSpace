define(
    function(require) {
        var config = require('json!config');
        var PIXI = require('pixi');

        var assets = {};

        assets.texture = {};

        assets.load = function (loadObj, callback) {
            var loadArray = [],
                loader;

            loadObj.texture.screenArrow = 'screenarrow.png';
            loadObj.texture.debug = 'debug.png';
            loadObj.texture.cameraDebug = 'camera_debug.png';
            loadObj.texture.cameraDebugGreen = 'camera_debug_green.png';
            loadObj.texture.cameraDebugYellow = 'camera_debug_yellow.png';

            loadObj.texture.bg_0 = 'bg_0.png';
            loadObj.texture.bg_1 = 'bg_1.png';
            loadObj.texture.bg_2 = 'bg_2.png';
            loadObj.texture.bg_3 = 'bg_3.png';

            // загрузка текстур
            _(loadObj.texture).forEach(function(el) {
                loadArray.push(config.pathToAssets + el);
            });

            loader = new PIXI.AssetLoader(loadArray);

            loader.onComplete = function() {
                _(loadObj.texture).forEach(function(el, i) {
                    assets.texture[i] = PIXI.Texture.fromImage(config.pathToAssets + el);
                });

                generateGraphicsTextures();

                callback();
            };

            loader.load();
        };

        function generateThrustTextures() {
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 5, 30);
            graphics.endFill();
            return graphics.generateTexture();
        }

        function generateSideTextures() {
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 10, 5);
            graphics.endFill();
            return graphics.generateTexture();
        }

        function generateGraphicsTextures() {
            assets.texture.thrust = generateThrustTextures();
            assets.texture.side = generateSideTextures();
        }

        return assets;
    }
);