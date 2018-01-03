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
    this.effectTimer = 0;

    this.glowFilter = new GlowFilter(
      10,       // distance
      1.5,        // outerStrength
      0.5,        // innerStrength
      0xfffce5, // color
      0.5       // quality
    );
    this.filterChangeTimer = 0;
  }

  gainWeight(sprite, sound) {
    sprite.anchor.set(0.5);
    sprite.y = 35;
    this.addChild(sprite);

    this.addedWeight = 0.00025;
    this.effectTimer = 8000;

    sound.play();
  }

  gainBalloon(sprite, sound) {
    sprite.anchor.set(0.5);
    sprite.y = -35;
    this.addChild(sprite);

    this.addedWeight = -0.00015;
    this.effectTimer = 8000;

    sound.play();
  }

  gainInvincibility() {
    this.invincible = true;
    this.filters = [ this.glowFilter ];
    this.effectTimer = 8000;
  }

  resetProperties() {
    this.addedWeight = 0;
    this.invincible = false;
    this.filters = null;
    this.effectChangeTimer = 0;

    for (let child of this.children) {
      this.removeChild(child);
    }
  }

  blink(rate) {
    if (this.filterChangeTimer > rate) {
      this.glowFilter.outerStrength = randomFloat(0.8, 1.8);
      this.filterChangeTimer -= rate;
    }
  }

  updateCurrent(dt) {
    this.updatePosition(dt);

    if (this.effectTimer > 0) {
      this.filterChangeTimer += dt;

      if (this.invincible) {
        this.blink(75);
      }

      this.effectTimer -= dt;

      if (this.effectTimer <= 0) {
        this.resetProperties();
      }
    }
  }
}
