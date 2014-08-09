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
        state.regMenu;
        state.followBodyNumber;


        function createFirstMenu() {
            var buttonQuickStart,
                buttonLogIn,
                buttonSignUp;

            state.firstMenu = interface.frame.create({
                anchor: 'CENTER'
            });

            buttonQuickStart = interface.button.create({
                text: 'Quick start',
                click: function() {
                    state.next();
                },
                position: [-150, -85]
            });
            state.firstMenu.addChild(buttonQuickStart);

            buttonLogIn = interface.button.create({
                text: 'Log in',
                color: 'red',
                click: function() {
                    state.firstMenu.hide();
                    state.loginMenu.show();
                },
                position: [-150, -25]
            });
            state.firstMenu.addChild(buttonLogIn);

            buttonSignUp = interface.button.create({
                text: 'Sign up',
                color: 'orange',
                click: function() {
                    state.firstMenu.hide();
                    state.regMenu.show();
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

            state.loginMenu.addChild(interface.text.create({
                text: 'Log in',
                position: [0, -120],
                anchor: [0.5, 1]
            }));

            login = interface.editbox.create({
                position: [-150, -115]
            });
            state.loginMenu.addChild(login);

            login.addChild(
                interface.text.create({
                    text: 'E-mail',
                    position: [-5, 25],
                    anchor: [1, 0.5]
                })
            );

            pass = interface.editbox.create({
                color: 'red',
                position: [-150, -55],
                type: 'pass'
            });
            state.loginMenu.addChild(pass);

            pass.addChild(
                interface.text.create({
                    text: 'Password',
                    position: [-5, 25],
                    anchor: [1, 0.5]
                })
            );

            state.loginMenu.addChild(interface.button.create({
                color: 'orange',
                text: 'Ok',
                position: [-150, 5],
                click: function() {
                }
            }));

            state.loginMenu.addChild(interface.button.create({
                color: 'green',
                text: 'Back',
                position: [-150, 65],
                click: function() {
                    state.loginMenu.hide();
                    state.firstMenu.show();
                }
            }));
        }

        function createRegMenu() {
            var login, pass, confirmPass;

            state.regMenu = interface.frame.create({
                anchor: 'CENTER',
                visible: false
            });

            state.regMenu.addChild(interface.text.create({
                text: 'Sign up',
                position: [0, -150],
                anchor: [0.5, 1]
            }));

            login = interface.editbox.create({
                position: [-150, -145]
            });
            state.regMenu.addChild(login);

            login.addChild(
                interface.text.create({
                    text: 'E-mail',
                    position: [-5, 25],
                    anchor: [1, 0.5]
                })
            );

            pass = interface.editbox.create({
                color: 'red',
                position: [-150, -85],
                type: 'pass'
            });
            state.regMenu.addChild(pass);

            pass.addChild(
                interface.text.create({
                    text: 'Password',
                    position: [-5, 25],
                    anchor: [1, 0.5]
                })
            );

            confirmPass = interface.editbox.create({
                color: 'red',
                position: [-150, -25],
                type: 'pass'
            });
            state.regMenu.addChild(confirmPass);

            confirmPass.addChild(
                interface.text.create({
                    text: 'Confirm password',
                    position: [-5, 25],
                    anchor: [1, 0.5]
                })
            );

            state.regMenu.addChild(interface.button.create({
                color: 'orange',
                text: 'Ok',
                position: [-150, 35],
                click: function() {
                }
            }));

            state.regMenu.addChild(interface.button.create({
                color: 'green',
                text: 'Back',
                position: [-150, 95],
                click: function() {
                    state.regMenu.hide();
                    state.firstMenu.show();
                }
            }));
        }

        state.start = function() {
            this.followBodyNumber = 1;
            game.camera.followTo(game.bodies[this.followBodyNumber]);

            createFirstMenu();
            createLoginMenu();
            createRegMenu();

            this.lastTimeChangeCamera = Date.now();
        };

        state.update = function() {
            var now = Date.now();

            function changeCamera() {
                state.lastTimeChangeCamera = now;
                state.followBodyNumber = state.followBodyNumber % _.size(game.bodies) + 1;
                game.camera.followTo(game.bodies[state.followBodyNumber]);
            }

            if (key.pressed.SPACE) {
                changeCamera();
            } else if (now - this.lastTimeChangeCamera > 7000) {
                changeCamera();
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