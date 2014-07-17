define(
    'game/bodies',
    ['game/game', 'game/utils'],
    function(game, utils) {
        var bodies = {};

        bodies.createTestObj = function(position, speed, angularSpeed) {
            var testObj = {};

            testObj.sprite = game.phaserGame.add.sprite(utils.sxp(position[0]), utils.sxp(position[1]), 'asteroid2');
            testObj.sprite.anchor.setTo(0.5, 0.5);

            console.log('testObj was create x: ' + utils.sxp(position[0]) + ' y: ' + utils.sxp(position[1]));

            return testObj;
        };

        return bodies;
    }
);