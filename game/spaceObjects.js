var objectList = {};

var getUniqueId = (function() {
    var i = 0;
    return function() {
        return i++;
    };
})();

var spaceObjects = {};

spaceObjects.add = function(body) {
    var newObj = {};
    newObj.id = getUniqueId();
    newObj.body = body;
    objectList[newObj.id] = newObj;

    return newObj;
};

spaceObjects.remove = function(spObj) {
    delete objectList[spObj.id];

    return this;
};

spaceObjects.getAllInfo = function() {
    var res = {},
        el, i, newEl;

    for (i in objectList) {
        el = objectList[i];

        newEl = {};
        newEl.id = el.id;
        newEl.position = el.body.getPosition();
/*        newEl.velocity = el.body.getVelocity();
        newEl.angularVelocity = el.body.getAngularVelocity();*/
        res[newEl.id] = newEl;
    }

    return res;
};

/*spaceObjects.updateAll = function() {

};*/

module.exports = spaceObjects;