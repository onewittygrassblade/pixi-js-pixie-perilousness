import { Sprite, BitmapText } from '../const/aliases.js';
import { GlowFilter } from '@pixi/filter-glow';

import Entity from './Entity.js';
import { randomFloat } from '../helpers/RandomNumbers.js';

export default class Pixie extends Entity {
  constructor(textureFrames, x, y, ay) {
    super(textureFrames, x, y, 0, 0, 0, ay);

    this.animationSpeed = 0.4;
    this.wingPower = -0.001;
    this.addedWeight = 0;
    this.invincible = false;

    this.glowFilter = new GlowFilter(
      10,         // distance
      1.5,        // outerStrength
      0.5,        // innerStrength
      0xfffce5,   // color
      0.5         // quality
    );
    this.filterChangeTimer = 0;
  }

  setNodeChildren(weight, balloon) {
    this.weightSprite = weight;
    this.weightSprite.anchor.set(0.5, 0.5);
    this.weightSprite.visible = false;
    this.balloonSprite = balloon;
    this.balloonSprite.anchor.set(0.5, 0.5);
    this.balloonSprite.visible = false;
  }

  gainInvincibility() {
    this.invincible = true;
    this.filters = [ this.glowFilter ];
  }

  resetInvincibility() {
    this.invincible = false;
    this.filters = null;
    this.filterChangeTimer = 0;
  }

  gainWeight() {
    this.weightSprite.visible = true;
    this.addedWeight = 0.00025;
  }

  resetWeight() {
    this.weightSprite.visible = false;
    this.addedWeight = 0;
  }

  gainBalloon() {
    this.balloonSprite.visible = true;
    this.addedWeight = -0.00015;
  }

  resetBalloon() {
    this.balloonSprite.visible = false;
    this.addedWeight = 0;
  }

  resetProperties() {
    this.resetInvincibility();
    this.addedWeight = 0;
    this.weightSprite.visible = false;
    this.balloonSprite.visible = false;
  }

  updateCurrent(dt) {
    this.updatePosition(dt);

    if (this.invincible) {
      this.filterChangeTimer += dt;

      if (this.filterChangeTimer > 75) {
        this.glowFilter.outerStrength = randomFloat(0.8, 1.8);
        this.filterChangeTimer -= 75;
      }
    }
  }
}
