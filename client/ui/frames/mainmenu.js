import ui from '../index';

const mainMenu = {};

let frame,
    buttonResume,
    buttonExit;

mainMenu.create = function() {
    frame = ui.frame.create({
        anchor: 'CENTER',
        width: 330,
        height: 140,
        position: [-160, -70],
        color: 'blue',
        visible: false
    });

    buttonResume = ui.button.create({
        text: 'Return to game',
        position: [15, 15],
        color: 'orange',
        click: function() {
            mainMenu.hide();
        }
    });

    frame.addChild(buttonResume);

    buttonExit = ui.button.create({
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

export {mainMenu as default};
