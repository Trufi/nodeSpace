let valid = {};

valid.passwordLength = function(pass) {
    return pass.length > 3;
};

valid.passwordsConfirm = function(pass, confirmPass) {
    return pass === confirmPass;
};

valid.email = function(str) {
    return /.+@.+\..+/i.test(str);
};

valid.name = function(str) {
    return (str.length > 3) && !/[^a-z0-9\s]/i.test(str);
};

export {valid as default};
