var _ = require('lodash');

var request = require('../../modules/request');
var key = require('../../modules/key');
var ui = require('../../ui/index');
var game = require('../../games/game');
var nextStage = require('./mainstate');

var state = {};
state.firstMenu;
state.loginMenu;
state.regMenu;
state.followBodyNumber;

// вначале undefined, после логина, квик старта или регистрации получает id
state.playerId;

// предлагать или нет сохранение после быстрого старта
state.proposeSignUp = false;


function createFirstMenu() {
    var buttonQuickStart;

    state.firstMenu = ui.frame.create({
        anchor: 'CENTER'
    });

    buttonQuickStart = ui.button.create({
        text: 'Quick start',
        click: function() {
            request.quickStart();
            state.proposeSignUp = true;
        },
        position: [-150, -85]
    });
    state.firstMenu.addChild(buttonQuickStart);
}

state.start = function() {
    this.followBodyNumber = 1;
    game.camera.followTo(game.bodies[this.followBodyNumber]);

    createFirstMenu();

    this.lastTimeChangeCamera = Date.now();

    request.changeStatusToPlayer(function(data) {
        state.changeStatusData = data;
    });
};

state.update = function() {
    var now = Date.now();

    function changeCamera() {
        state.lastTimeChangeCamera = now;
        state.followBodyNumber = state.followBodyNumber % _.size(game.bodies) + 1;
        game.camera.followTo(game.bodies[state.followBodyNumber]);
    }

    if (key.pressed.SPACE || (now - this.lastTimeChangeCamera) > 7000) {
        changeCamera();
    }

    if (this.changeStatusData !== undefined && game.users[this.changeStatusData.user[0]] !== undefined) {
        this.next();
    }
};

state.render = function() {

};

state.close = function() {
    this.firstMenu.hide();
};

state.next = function() {
    var options = {
        changeStatusData: this.changeStatusData,
        proposeSignUp: this.proposeSignUp
    };

    game.changeState(nextStage, options);
};

state.newData = function() {};

state.removeData = function() {};

module.exports = state;
