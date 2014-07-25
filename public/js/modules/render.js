define(
    function(require) {
        var PIXI = require('pixi');
        var config = require('json!config');

        var render = {};

        render.create = function(options) {
            options = options || {};

            // разрешение рендера
            this.resolution = options.resolution || [1024, 768];

            this.render = PIXI.autoDetectRenderer(this.resolution[0], this.resolution[1]);
            this.render.view.style.display = 'block';

            document.getElementById(config.gameHtmlWrapId).appendChild(this.render.view);
        };

        render.draw = function(stage) {
            this.render.render(stage);
        };

        return render;
    }
);