import Action from './Action';

const typeToMoveName = ['thrust', 'reverse', 'left', 'right', null, 'strafeLeft', 'strafeRight', 'angularBrake'];

export default class Move extends Action {
    constructor(options) {
       super(options);

        this.ship = options.body;
        this.moveName = typeToMoveName[options.name - 1];
    }
}
