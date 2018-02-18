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

  gainInvincibility() {
    this.invincible = true;
    this.filters = [ this.glowFilter ];
  }

  resetInvincibility() {
    this.invincible = false;
    this.filters = null;
    this.filterChangeTimer = 0;
  }

  resetWeight() {
    this.addedWeight = 0;
    for (let child of this.children) {
      this.removeChild(child);
    }
  }

  resetProperties() {
    this.resetInvincibility();
    this.resetWeight();
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
