define(
    function(require) {
        var interface = require('interface/index');

        var mainMenu = {};

        var frame,
            buttonResume,
            buttonExit;

        mainMenu.create = function() {
            frame = interface.frame.create({
                anchor: 'CENTER',
                width: 330,
                height: 140,
                position: [-160, -70],
                color: 'blue',
                visible: false
            });

            buttonResume = interface.button.create({
                text: 'Return to game',
                position: [15, 15],
                color: 'orange',
                click: function() {
                    mainMenu.hide();
                }
            });

            frame.addChild(buttonResume);

            buttonExit = interface.button.create({
                text: 'Exit',
                position: [15, 75],
                color: 'green',
                click: function() {
                    mainMenu.hide();
                }
            });

            frame.addChild(buttonExit);
        };

        mainMenu.show = function() {
            frame.show();
        };

        mainMenu.hide = function() {
            frame.hide();
        };

        mainMenu.toggle = function() {
            frame.toggle();
        };

        return mainMenu;
    }
);