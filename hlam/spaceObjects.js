var objectList = {};

var getUniqueId = (function() {
    var i = 0;
    return function() {
        return i++;
    };
})();

var spaceObjects = {};

spaceObjects.add = function(self) {
    var newObj = {};
    newObj.id = getUniqueId();
    newObj.self = self;
    objectList[newObj.id] = newObj;

    return newObj;
};

spaceObjects.remove = function(spObj) {
    delete objectList[spObj.id];

    return this;
};

spaceObjects.getStepInfo = function() {
    var res = {},
        i;

    for (i in objectList) {
        res[i] = objectList[i].self.getStepInfo();
    }

    return res;
};

spaceObjects.getFirstInfo = function() {
    var res = {},
        i;

    for (i in objectList) {
        res[i] = objectList[i].self.getFirstInfo();
    }

    return res;
};

module.exports = spaceObjects;