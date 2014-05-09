var p2 = require('p2');
var spaceObjects = require('./spaceObjects');
var Player = require('./player');
var world = require('./world');

var getUniqueId = (function() {
    var i = 0;
    return function() {
        return i++;
    };
})();


// для теста
var Body = require('./body');
var asteroid = new Body();
spaceObjects.add(asteroid);
var timeStep = 1;
/*setInterval(function() {
    world.step(timeStep);
}, 1000 * timeStep);*/
// для теста

function gameInit(socket) {
    //var player = new Player();


    socket.emit('playerIsConnect',  spaceObjects.getFirstInfo());

    /*socket.on('update', function (data) {
        player.setPosition(data.position);
    });*/

    setInterval(function () {
        world.step(timeStep);
        socket.emit('updateClient', spaceObjects.getStepInfo());
    }, 1000 * timeStep);
}

exports.init = gameInit;