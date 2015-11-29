import Action from './Action';

const typeToMoveName = ['thrust', 'reverse', 'left', 'right', null, 'strafeLeft', 'strafeRight', 'angularBrake'];

export default class Move extends Action {
    constructor(options) {
        super(options);

        this.ship = options.body;
        this.moveName = typeToMoveName[options.name - 1];
        this.type = options.name;
    }

    _run(now) {
        this.ship.actionsUsed.push(this.type);
        this.ship[this.moveName](now);
    }
}
