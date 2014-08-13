define(
    function(require) {
        var PIXI = require('pixi');
        var config = require('json!config');

        var render = {};

        render.create = function(options) {
            var gameWrap = document.getElementById(config.gameHtmlWrapId);

            options = options || {};

            // разрешение рендера
            this.resolution = options.resolution || [window.innerWidth, window.innerHeight];

            this.render = PIXI.autoDetectRenderer(this.resolution[0], this.resolution[1]);
            this.render.view.style.display = 'block';


            document.getElementById('gamepreloader').style.display = 'none';
            gameWrap.style.display = 'block';
            gameWrap.appendChild(this.render.view);

            /*window.addEventListener('resize', function(ev){
                _this.resolution = [window.innerWidth, window.innerHeight];
                _this.render.width = _this.resolution[0];
                _this.render.height = _this.resolution[1];
            });*/
        };

        render.draw = function(stage) {
            this.render.render(stage);
        };

        return render;
    }
);