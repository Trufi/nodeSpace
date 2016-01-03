import PIXI from 'pixi.js';
import _ from 'lodash';
import p2 from 'p2';

import assets from '../../modules/assets';
import camera from '../../modules/camera';
import render from '../../modules/render';
import step from '../../modules/step';
import Body from '../Body';
import mask from '../mask';
import * as actions from '../../actions';
import * as weapons from '../weapons';

export default class Ship extends Body {
    constructor(options) {
        super(options);

        this.weapons = [];
    }

    applyActions() {
        [1, 2, 3, 4, 6, 7, 8].forEach(el => {
            this.actions[el] = actions.create({body: this, name: el});
        });

        // добавляем действие для конкретного оружия
        this.actions[5] = actions.create({body: this, name: 5, weapons: this.weapons});
    }

    applyWeapons() {
        this.weapons[0] = weapons.create({
            position: [-10, 0],
            parent: this
        });

        this.weapons[1] = weapons.create({
            position: [10, 0],
            parent: this
        });
    }

    weaponsAimActivate() {
        this.weapons[0].createAim();
        render.layers[4].addChild(this.weapons[0].spriteAim);
        this.weapons[1].createAim();
        render.layers[4].addChild(this.weapons[1].spriteAim);
    }

    weaponsGoto(point) {
        _.forEach(this.weapons, function(el) {
            el.goto(point);
        });
    }

    applyShape() {
        this.shape = new p2.Box({width: 60, height: 40});
        this.shape.collisionGroup = mask.SHIP;
        this.shape.collisionMask = mask.BODY | mask.SHIP | mask.BULLET;
        this.body.addShape(this.shape);
    }

    createSprite() {
        this.sprite = new PIXI.Sprite(assets.texture.ship);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.spriteSize = 60;

        // спрайт для thrust
        this.spriteThrust = new PIXI.Sprite(assets.texture.thrust);
        this.spriteThrust.anchor.x = 0;
        this.spriteThrust.anchor.y = 0.5;
        this.spriteThrust.position.x = -35;
        this.spriteThrust.position.y = 0;
        this.sprite.addChild(this.spriteThrust);

        // спрайт для reverse
        this.spriteReverse = new PIXI.Sprite(assets.texture.thrust);
        this.spriteReverse.anchor.x = 0;
        this.spriteReverse.anchor.y = 0.5;
        this.spriteReverse.position.x = 30;
        this.spriteReverse.position.y = 0;
        this.spriteReverse.height = 15;
        this.spriteReverse.width = 5;
        this.sprite.addChild(this.spriteReverse);

        // боковые спрайты
        this.spriteSide = [];

        const createSideSprite = (x, y) => {
            const sprite = new PIXI.Sprite(assets.texture.side);
            sprite.position.x = x;
            sprite.position.y = y;
            this.sprite.addChild(sprite);
            return sprite;
        };

        this.spriteSide[0] = createSideSprite(-20, -25);
        this.spriteSide[1] = createSideSprite(10, -25);
        this.spriteSide[2] = createSideSprite(-20, 20);
        this.spriteSide[3] = createSideSprite(10, 20);

        this.applyWeapons();
    }

    updateSprite(now) {
        this.sprite.position.x = camera.x(this.body.position[0]);
        this.sprite.position.y = camera.y(this.body.position[1]);
        this.sprite.rotation = this.body.angle;
        this.sprite.scale = new PIXI.Point(camera.scale(), camera.scale());

        // проверям actions
        this.spriteThrust.visible = this.actions[1].isAnimate(now);
        this.spriteReverse.visible = this.actions[2].isAnimate(now);

        this.spriteSide[0].visible = false;
        this.spriteSide[1].visible = false;
        this.spriteSide[2].visible = false;
        this.spriteSide[3].visible = false;

        if (this.actions[3].isAnimate(now)) {
            this.spriteSide[0].visible = true;
            this.spriteSide[3].visible = true;
        } else if (this.actions[4].isAnimate(now)) {
            this.spriteSide[1].visible = true;
            this.spriteSide[2].visible = true;
        } else if (this.actions[6].isAnimate(now)) {
            this.spriteSide[2].visible = true;
            this.spriteSide[3].visible = true;
        } else if (this.actions[7].isAnimate(now)) {
            this.spriteSide[0].visible = true;
            this.spriteSide[1].visible = true;
        }
    }

    addToGame(game) {
        if (!this._updatedFromServer) {
            game.world.addBody(this.body);
        }

        _.forEach(this.weapons, el => step.addWeapon(el));

        render.layers[2].addChild(this.sprite);

        this.game = game;
    }
}
