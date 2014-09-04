define(
    function() {
        var key = {};

        /*var keyCodes = {
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
        };*/
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
            32: 'SPACE',
            8: 'BACKSPACE',
            46: 'DELETE',
            35: 'END',
            36: 'HOME',
            9: 'TAB',
            27: 'ESC',
            'MOUSELEFT': 'MOUSELEFT',
            'MOUSEMID': 'MOUSEMID',
            'MOUSERIGHT': 'MOUSERIGHT'
        };

        // кнопки которые блокируют действия браузера
        var defaultKeyBlock = [8, 9];
        var keyPressed = {};
        var keyDown = {};

        // включен ли набор текста
        var isWriteText = false;
        var writeTextCallback;
        // кнопки которые будут передаваться в writeTextCallback при событии keydown
        var keyForTextEdit = [13, 37, 39, 8, 46, 35, 36, 9];

        window.addEventListener('keydown', function(ev) {
            var keyCode = ev.keyCode || ev.which,
                keyStr;

            if (defaultKeyBlock.indexOf(keyCode) !== -1) {
                ev.preventDefault();
            }

            if (!isWriteText) {
                keyStr = codesToKey[keyCode];
                keyPressed[keyStr] = true;
                keyDown[keyStr] = true;
            } else {
                if (keyForTextEdit.indexOf(keyCode) !== -1) {
                    writeTextCallback(codesToKey[keyCode]);
                }
            }
        });

        window.addEventListener('keypress', function(ev) {
            var code,
                ch;

            if (isWriteText) {
                code = ev.keyCode || ev.charCode;

                if (code !== 13) {
                    ch = String.fromCharCode(code);

                    if (ev.shiftKey) {
                        ch.toUpperCase();
                    }

                    writeTextCallback(ch);
                }
            }
        });

        window.addEventListener('keyup', function(ev) {
            var keyCode = ev.keyCode || ev.which;
            keyDown[codesToKey[keyCode]] = false;
        });

        window.addEventListener('wheel', function(ev) {
            if (ev.deltaY < 0) {
                keyPressed['WHEELUP'] = true;
            } else {
                keyPressed['WHEELDOWN'] = true;
            }
        });

        window.addEventListener('mousedown', function(ev) {
            switch (ev.which) {
                case 1:
                    keyDown.MOUSELEFT = true;
                    break;
                case 2:
                    keyDown.MOUSEMID = true;
                    break;
                case 3:
                    keyDown.MOUSERIGHT = true;
                    break;
            }
        });

        window.addEventListener('mouseup', function(ev) {
            switch (ev.which) {
                case 1:
                    keyDown.MOUSELEFT = false;
                    break;
                case 2:
                    keyDown.MOUSEMID = false;
                    break;
                case 3:
                    keyDown.MOUSERIGHT = false;
                    break;
            }
        });

        window.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();
            return false;
        });

        key.pressed = keyPressed;

        key.reset = function() {
            for (var i in keyPressed) {
                keyPressed[i] = false;
            }
        };

        key.down = keyDown;

        key.enableWriteText = function(callback) {
            isWriteText = true;
            key.reset();
            writeTextCallback = callback;
        };

        key.disableWriteText = function() {
            isWriteText = false;
            writeTextCallback = undefined;
        };

        return key;
    }
);