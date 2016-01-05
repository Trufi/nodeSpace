import request from './modules/request';
import render from './modules/render';
import enterstate from './games/first/enter';
import mainstate from './games/first/mainstate';
import game from './games/game';
import position from './ui/position';

window.JS_ENV = window.JS_ENV || 'production';
console.log('Development mode enable');

request.gameInit(data => {
    game.load(data, () => {
        render.create();
        position.update();

        if (data.user.type === 0) {
            game.changeState(enterstate);
        } else {
            game.changeState(mainstate);
        }
        game.start(data);
    });
});
