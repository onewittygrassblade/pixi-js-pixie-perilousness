import Entity from './Entity.js';
import { randomFloat } from '../helpers/RandomNumbers.js';

export default class Pixie extends Entity {
  constructor(textureFrames, x, y, ay) {
    super(textureFrames, x, y, 0, 0, 0, ay);

    this.animationSpeed = 0.4;
    this.wingPower = -0.001;
    this.addedGravity = 0;
    this.invincible = false;
    this.effectTimer = 0;
    this.effectChangeTimer = 0;
  }

  gainWeight(sprite, sound) {
    sprite.anchor.set(0.5);
    sprite.y = 35;
    this.addChild(sprite);

    this.addedGravity = 0.00025;
    this.effectTimer = 10000;

    sound.play();
  }

  gainBalloon(sprite, sound) {
    sprite.anchor.set(0.5);
    sprite.y = -35;
    this.addChild(sprite);

    this.addedGravity = -0.00015;
    this.effectTimer = 10000;

    sound.play();
  }

  gainInvincibility() {
    this.invincible = true;
    this.effectTimer = 10000;

    // sound.play();
  }

  resetProperties() {
    this.addedGravity = 0;
    this.invincible = false;
    this.filters = null;
    this.effectChangeTimer = 0;

    for (let child of this.children) {
      this.removeChild(child);
    }
  }

  blink(rate) {
    if (this.effectChangeTimer > rate) {
      let colorMatrix = new PIXI.filters.ColorMatrixFilter();
      colorMatrix.brightness(randomFloat(1, 1.25), true);
      this.filters = [colorMatrix];

      this.effectChangeTimer -= rate;
    }
  }

  updateCurrent(dt) {
    this.updatePosition(dt);

    if (this.effectTimer > 0) {
      this.effectChangeTimer += dt;

      if (this.invincible) {
        this.blink(50);
      }

      this.effectTimer -= dt;

      if (this.effectTimer <= 0) {
        this.resetProperties();
      }
    }
  }
}
