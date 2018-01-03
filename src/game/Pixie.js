import Entity from './Entity.js';

export default class Pixie extends Entity {
  constructor(textureFrames, x, y, ay) {
    super(textureFrames, x, y, 0, 0, 0, ay);

    this.animationSpeed = 0.4;
    this.wingPower = -0.001;
    this.addedWeight = 0;
    this.invincible = false;
    this.effectTimer = 0;
    this.colorMatrix = new PIXI.filters.ColorMatrixFilter();
    this.hueRotation = 0;
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

  blink() {
    this.colorMatrix.hue(this.hueRotation, false);
    this.hueRotation += 20;
    if (this.hueRotation == 360) {
      this.hueRotation = 0;
    }
    this.filters = [this.colorMatrix];
  }

  updateCurrent(dt) {
    this.updatePosition(dt);

    if (this.effectTimer > 0) {
      this.effectChangeTimer += dt;

      if (this.invincible) {
        this.blink();
      }

      this.effectTimer -= dt;

      if (this.effectTimer <= 0) {
        this.resetProperties();
      }
    }
  }
}
