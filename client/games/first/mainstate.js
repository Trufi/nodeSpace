import _ from 'lodash';

import player from '../../modules/player';
import render from '../../modules/render';
import debug from '../../modules/debug';
import key from '../../modules/key';
import ui from '../../ui';
import mainMenu from '../../ui/frames/mainmenu';
import ScreenArrow from '../../ui/screenarrow';
import game from '../game';

let state = {};

state.start = function(options) {
    // присваиваем User игроку
    player.setUser(game.getUser(options.changeStatusData.user.id || options.user.id));

    game.camera.followTo(player.user.ship);

    this.scrArrow = new ScreenArrow({
        camera: game.camera,
        target: game.bodies[1]
    });

    _.forEach(game.users, function(el) {
        ui.bodyInfo.create({
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
    } else if (!key.down.CTRL) {
        player.action(now, 8);
    }

    if (key.down.MOUSELEFT) {
        player.action(now, 5);
    }

    if (key.pressed.ESC) {
        mainMenu.toggle();
    }

    player.user.ship.weaponsGoto(render.render.plugins.interaction.mouse.global);
    this.scrArrow.update();
    ui.bodyInfo.update();
    debug.update();
};

state.render = function() {

};

state.close = function() {

};

state.newData = function(data) {
    _.forEach(data.users, function(el) {
        ui.bodyInfo.create({
            body: game.getUser(el.id).getShip()
        });
    });
};

state.removeData = function(data) {

};

export {state as default};
