var _ = require('lodash');

var player = require('../../modules/player');
var render = require('../../modules/render');
var debug = require('../../modules/debug');
var key = require('../../modules/key');

var mainMenu = require('../../interface/frames/mainmenu');
var ScreenArrow = require('../../interface/screenarrow');
var interface = require('../../interface/index');

var game = require('../game');

var state = {};

state.start = function(options) {
    // присваиваем User игроку
    player.setUser(game.users[options.changeStatusData.user[0] || options.user[0]]);

    game.camera.followTo(player.user.ship);

    this.scrArrow = new ScreenArrow({
        camera: game.camera,
        target: game.bodies[1]
    });

    _.forEach(game.users, function(el) {
        interface.bodyInfo.create({
            body: el.ship
        });
    });

    debug.pingOn();
    player.user.ship.weaponsAimActivate();

    // добавим гланое меню
    mainMenu.create();
};

state.update = function(now) {
    if (key.pressed.WHEELDOWN) {
        game.camera.zoomOut();
    } else if (key.pressed.WHEELUP) {
        game.camera.zoomIn();
    }

    if (key.down.W) {
        player.action(now, 1);
    } else if (key.down.S) {
        player.action(now, 2);
    }

    if (key.down.A) {
        player.action(now, 3);
    } else if (key.down.D) {
        player.action(now, 4);
    } else if (key.down.Q) {
        player.action(now, 6);
    } else if (key.down.E) {
        player.action(now, 7);
    } else if (!key.down.CTRL && player.user.ship.body.angularVelocity !== 0) {
        player.action(now, 8);
    }

    if (key.down.MOUSELEFT) {
        player.action(now, 5);
    }

    if (key.pressed.ESC) {
        mainMenu.toggle();
    }

    player.user.ship.weaponsGoto(render.stage.getMousePosition());
    this.scrArrow.update();
    interface.bodyInfo.update();
    debug.update();
};

state.render = function() {

};

state.close = function() {

};

state.newData = function(data) {
    _.forEach(data[1], function(el) {
        interface.bodyInfo.create({
            body: game.users[el[0]].ship
        });
    });
};

state.removeData = function(data) {

};

module.exports = state;
