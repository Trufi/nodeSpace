var uniqueId = (function () {
    var count = 0;
    return function () {
        return count++;
    };
})();

function Player(param) {
    this.id = uniqueId();

    this.position = {};
    this.position.x = 0;
    this.position.y = 0;
}

Player.prototype.setPosition = function (obj) {
    this.position.x = obj.x;
    this.position.y = obj.y;

    return this;
};

Player.prototype.getPosition = function () {
    return this.position;
};

module.exports = Player;