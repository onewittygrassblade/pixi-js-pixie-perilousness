import { GlowFilter } from '@pixi/filter-glow';

import { Sprite } from '../const/aliases';

import Entity from './Entity';
import Particle from '../particle/Particle';
import { randomFloat } from '../helpers/RandomNumbers';

import {
  GRAVITY,
  WING_POWER,
  WEIGHT_ACC,
  BALLOON_ACC,
} from '../const/pixie';

export default class Pixie extends Entity {
  constructor(textureFrames, x, y, weightTexture, balloonTexture, starTexture) {
    super(textureFrames, x, y, 0, 0, 0, GRAVITY);

    this.animationSpeed = 0.4;
    this.invincible = false;
    this.flapping = false;

    this.weight = new Sprite(weightTexture);
    this.weight.anchor.set(0.5, 0.5);
    this.weight.visible = false;
    this.addNodeChild(this.weight, 0, 35);

    this.balloon = new Sprite(balloonTexture);
    this.balloon.anchor.set(0.5, 0.5);
    this.balloon.visible = false;
    this.addNodeChild(this.balloon, 0, -35);

    this.star = new Particle(
      [starTexture],
      1000,
    );
    this.star.shrinkVelocity = -0.0007;
    this.star.visible = false;
    this.addNodeChild(this.star, 0, -45);

    /* eslint-disable no-multi-spaces */
    this.glowFilter = new GlowFilter(
      10,         // distance
      1.5,        // outerStrength
      0.5,        // innerStrength
      0xfffce5,   // color
      0.5,        // quality
    );
    /* eslint-enable no-multi-spaces */
    this.filterChangeTimer = 0;
  }

  flapWings() {
    this.play();
    if (!this.flapping) {
      this.ay += WING_POWER;
      this.flapping = true;
    }
  }

  stopFlapping() {
    this.gotoAndStop(0);
    if (this.flapping) {
      this.ay -= WING_POWER;
      this.flapping = false;
    }
  }

  gainInvincibility() {
    this.invincible = true;
    this.filters = [this.glowFilter];
  }

  resetInvincibility() {
    this.invincible = false;
    this.filters = null;
    this.filterChangeTimer = 0;
  }

  gainWeight() {
    this.weight.visible = true;
    this.ay += WEIGHT_ACC;
  }

  resetWeight() {
    this.weight.visible = false;
    this.ay -= WEIGHT_ACC;
  }

  gainBalloon() {
    this.balloon.visible = true;
    this.ay += BALLOON_ACC;
  }

  resetBalloon() {
    this.balloon.visible = false;
    this.ay -= BALLOON_ACC;
  }

  resetProperties() {
    this.resetInvincibility();
    this.flapping = false;
    this.ay = GRAVITY;
    this.weight.visible = false;
    this.balloon.visible = false;
  }

  showStar() {
    this.star.width = 20;
    this.star.height = 20;
    this.star.visible = true;
  }

  updateCurrent(dt) {
    this.updatePosition(dt);

    if (this.star.visible) {
      this.star.updateCurrent(dt);
      if (this.star.currentLifetime >= this.star.lifetime) {
        this.star.currentLifetime = 0;
        this.star.visible = false;
      }
    }

    if (this.invincible) {
      this.filterChangeTimer += dt;

      if (this.filterChangeTimer > 75) {
        this.glowFilter.outerStrength = randomFloat(0.8, 1.8);
        this.filterChangeTimer -= 75;
      }
    }
  }
}
