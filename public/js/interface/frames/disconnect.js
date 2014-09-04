define(
    function(require){
        var interface = require('interface/index');

        var disconnect = {};

        var frame, text, timeText, interval, timeLeft, timeStart;

        disconnect.show = function(val) {
            frame = interface.frame.create({
                anchor: 'CENTER',
                color: 'red',
                position: [-200, -50],
                width: 400,
                height: 100,
                opacity: 0.9
            });

            text = interface.text.create({
                text: 'Disconnect...',
                position: [200, 30],
                anchor: [0.5, 0.5]
            });

            frame.addChild(text);

            timeText = interface.text.create({
                text: '',
                position: [200, 65],
                anchor: [0.5, 0.5]
            });

            frame.addChild(timeText);

            disconnect.show = _show;
            _show(val);
        };

        var _show = function(val) {
            timeLeft = val;
            timeStart = Date.now();

            frame.show();
            timeText.setText(Math.ceil(timeLeft / 1000));

            interval = setInterval(function() {
                var val = Math.max(Math.ceil((timeLeft - (Date.now() - timeStart)) / 1000), 0);
                timeText.setText(val);
            }, 1000);
        };

        disconnect.hide = function() {
            frame.hide();
            clearInterval(interval);
        };

        disconnect.setTime = function(val){
            timeText.setText(val);
        };

        return disconnect;
    }
);