import PIXI from 'pixi.js';

import assets from '../../modules/assets';
import camera from '../../modules/camera';
import render from '../../modules/render';
import step from '../../modules/step';
import * as weapons from '../weapons';

let idCounter = 1;

function resetAngle(angle) {
    const sign = angle > 0 ? 1 : -1;
    return sign * ((Math.abs(angle) + Math.PI) % (Math.PI * 2) - Math.PI);
}

export default class Weapon {
    constructor(options) {
        this.id = options.id;

        this.parent = options.parent;
        this.angularVelocity = 5;
        this.toAngle = options.angle || 0;
        this.position = options.position || [0, 0];

        this.radius = 200;
        this.angle = 0;
    }

    step(dt) {
        const dAngle = this.angularVelocity * dt;
        let angleNeed = resetAngle(this.angle - this.toAngle);
        const sign = angleNeed > 0 ? 1 : -1;

        angleNeed = Math.abs(angleNeed);

        if (angleNeed < dAngle) {
            this.angle = this.toAngle;
        } else if (angleNeed < Math.PI * 2 - angleNeed) {
            this.angle = this.angle - sign * dAngle;
        } else {
            this.angle = this.angle + sign * dAngle;
        }
    }

    createAim() {
        this.spriteAim = new PIXI.Sprite(assets.texture.aimRed);
        this.spriteAim.width = 20;
        this.spriteAim.height = 20;
        this.spriteAim.anchor.x = 0.5;
        this.spriteAim.anchor.y = 0.5;
    }

    updateAim() {
        let angle = this.angle;
        const angleNeed = Math.abs(resetAngle(angle - this.toAngle));
        const parentAngle = this.parent.body.angle;
        const weaponPos = [
            this.position[0] * Math.cos(parentAngle) - this.position[1] * Math.sin(parentAngle),
            this.position[0] * Math.sin(parentAngle) + this.position[1] * Math.cos(parentAngle)
        ];

        if (angleNeed < Math.PI / 16) {
            angle = this.toAngle;
        }

        this.spriteAim.position.x = weaponPos[0] * camera.scale() +
            this.radius * Math.cos(angle + parentAngle) + render.resolution[0] / 2;

        this.spriteAim.position.y = weaponPos[1] * camera.scale() +
            this.radius * Math.sin(angle + parentAngle) + render.resolution[1] / 2;
    }

    goto(point) {
        const pointPos = [point.x - render.resolution[0] / 2, point.y - render.resolution[1] / 2];
        const parentAngle = this.parent.body.angle;
        let weaponPos = [
            this.position[0] * Math.cos(parentAngle) - this.position[1] * Math.sin(parentAngle),
            this.position[0] * Math.sin(parentAngle) + this.position[1] * Math.cos(parentAngle)
        ];

        weaponPos = [weaponPos[0] * camera.scale(), weaponPos[1] * camera.scale()];

        this.toAngle = Math.atan2((pointPos[1] - weaponPos[1]), (pointPos[0] - weaponPos[0])) - parentAngle;

        this.updateAim();
    }

    getAngle() {
        return this.angle;
    }
}

export function create(options = {}) {
    options.id = idCounter++;

    return new Weapon(options);
}
