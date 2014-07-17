define(
    'game/user',
    [],
    function() {
        var User = function User(param) {
            this.id = param.id;
        };

        return User;
    }
);