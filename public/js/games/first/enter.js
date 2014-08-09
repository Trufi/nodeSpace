define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var key = require('modules/key');
        var interface = require('interface/index')
        var nextStage = require('./mainstate');

        var state = {};
        state.firstMenu;
        state.loginMenu;
        state.followBodyNumber;


        function createFirstMenu() {
            var buttonQuickStart,
                buttonLogIn,
                buttonSignUp;

            state.firstMenu = interface.frame.create({
                anchor: 'CENTER'
            });

            buttonQuickStart = interface.button.create({
                text: 'Quick Start',
                click: function() {
                    state.next();
                },
                position: [-150, -85]
            });
            state.firstMenu.addChild(buttonQuickStart);

            buttonLogIn = interface.button.create({
                text: 'Log In',
                color: 'red',
                click: function() {
                    state.firstMenu.hide();
                    state.loginMenu.show();
                },
                position: [-150, -25]
            });
            state.firstMenu.addChild(buttonLogIn);

            buttonSignUp = interface.button.create({
                text: 'Sign Up',
                click: function() {
                    console.log('lol');
                },
                position: [-150, 35]
            });
            state.firstMenu.addChild(buttonSignUp);
        };

        function createLoginMenu() {
            var login, pass;
            state.loginMenu = interface.frame.create({
                anchor: 'CENTER',
                visible: false
            });

            login = interface.editbox.create({
                color: 'red',
                position: [-150, -55]
            });
            state.loginMenu.addChild(login);

            pass = interface.editbox.create({
                position: [-150, 5]
            });
            state.loginMenu.addChild(pass);
        }

        state.start = function() {
            this.followBodyNumber = 1;
            game.camera.followTo(game.bodies[this.followBodyNumber]);

            createFirstMenu();
            createLoginMenu();
        };

        state.update = function() {
            if (key.pressed.SPACE) {
                this.followBodyNumber = this.followBodyNumber % _.size(game.bodies) + 1;
                game.camera.followTo(game.bodies[this.followBodyNumber]);
            }
        };

        state.render = function() {

        };

        state.close = function() {
            this.firstMenu.hide();
            this.loginMenu.hide();
        };

        state.next = function() {
            game.changeState(nextStage);
        };

        return state;
    }
);