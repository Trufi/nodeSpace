define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var key = require('modules/key');
        var interface = require('interface/index');
        var nextStage = require('./mainstate');
        var valid = require('modules/valid');
        var config = require('json!config');
        var request = require('modules/request');

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
        }

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
                    var email = login.value(),
                        passVal = pass.value(),
                        validNoErrors = false;

                    if (valid.email(email)) {
                        if (valid.passwordLength(passVal)) {
                            validNoErrors = true;
                        } else {
                            error.setText(config.errors.minPasswordLength);
                        }
                    } else {
                        error.setText(config.errors.emailNotValid);
                    }

                    if (validNoErrors) {
                        request.login(email, passVal, function() {
                            console.log('login done');
                        });
                    }
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

            error = interface.text.create({
                text: '',
                color: 'ff0000',
                position: [160, 30],
                fontSize: 18,
                anchor: [0, 0.5]
            });
            state.loginMenu.addChild(error);
        }

        function createRegMenu() {
            var login, pass, confirmPass, error;

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
                    var email = login.value(),
                        passVal = pass.value(),
                        confirmPassVal = confirmPass.value(),
                        validNoErrors = false;

                    if (valid.email(email)) {
                        if (valid.passwordLength(passVal)) {
                            if (valid.passwordsConfirm(passVal, confirmPassVal)) {
                                validNoErrors = true;
                            } else {
                                error.setText(config.errors.passwordsDontMatch);
                            }
                        } else {
                            error.setText(config.errors.minPasswordLength);
                        }
                    } else {
                        error.setText(config.errors.emailNotValid);
                    }

                    if (validNoErrors) {
                        request.signUp(email, passVal, function() {
                            console.log('done');
                        });
                    }
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

            error = interface.text.create({
                text: '',
                color: 'ff0000',
                position: [160, 60],
                fontSize: 18,
                anchor: [0, 0.5]
            });
            state.regMenu.addChild(error);
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

            if (key.pressed.SPACE || (now - this.lastTimeChangeCamera) > 7000) {
                changeCamera();
            }
        };

        state.render = function() {

        };

        state.close = function() {
            this.firstMenu.hide();
            this.loginMenu.hide();
        };

        state.next = function(options) {
            game.changeState(nextStage, options);
        };

        state.changeStatus = function(player) {
            if (player.type === 1) {
                state.next({user: player});
            }
        };

        return state;
    }
);