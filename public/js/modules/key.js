define(
    function(require) {
        var key = {};

        var keyCodes = {
            1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, 0: 48,
            Q: 81, W: 87, E: 69, R: 82, T: 84, Y: 89, U: 85, I: 73, O: 79, P: 80,
            A: 65, S: 83, D: 68, F: 70, G: 71, H: 72, J: 74, K: 75, L: 76,
            Z: 90, X: 88, C: 67, V: 86, B: 66, N: 78, M: 77,
            CTRL: 17,
            SHIFT: 16,
            ALT: 18,
            ENTER: 13,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SPACE: 32
        };
        //TODO: доделать остальные кнопки

        var codesToKey = {
            49: 1, 50: 2, 51: 3, 52: 4, 53: 5, 54: 6, 55: 7, 56: 8, 57: 9, 48: 0,
            81: 'Q', 87: 'W', 69: 'E', 82: 'R', 84: 'T', 89: 'Y', 85: 'U', 73: 'I', 79: 'O', 80: 'P',
            65: 'A', 83: 'S', 68: 'D', 70: 'F', 71: 'G', 72: 'H', 74: 'J', 75: 'K', 76: 'L',
            90: 'Z', 88: 'X', 67: 'C', 86: 'V', 66: 'B', 78: 'N', 77: 'M',
            17: 'CTRL',
            16: 'SHIFT',
            18: 'ALT',
            13: 'ENTER',
            37: 'LEFT',
            38: 'UP',
            39: 'RIGHT',
            40: 'DOWN',
            32: 'SPACE'
        };

        var keyPressed = {};

        document.onkeydown = function(ev) {
            keyPressed[codesToKey[ev.keyCode]] = true;
            //key.check = true;
        };

        document.onwheel = function(ev) {
            if (ev.deltaY < 0) {
                keyPressed['WHEELUP'] = true;
            } else {
                keyPressed['WHEELDOWN'] = true;
            }
        };

        key.press = keyPressed;

        key.reset = function() {
            for (var i in keyPressed) {
                keyPressed[i] = false;
            }
        };

        return key;
    }
);