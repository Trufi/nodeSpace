define(
    function(require) {
        var valid = {};

        valid.passwordLength = function(pass) {
            return pass.length > 3;
        };

        valid.passwordsConfirm = function(pass, confirmPass) {
            return pass === confirmPass;
        };

        valid.email = function(str) {
            return /.+@.+\..+/i.test(str);
        };

        return valid;
    }
);