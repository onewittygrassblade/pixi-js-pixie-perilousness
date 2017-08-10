import Entity from './Entity.js';
import { randomInt } from './helpers/RandomNumbers.js';

import { ParticleContainer } from './const/aliases.js';

export default class Particle extends Entity {
  constructor(
    textureFrames,
    lifetime,
    size = null,
    x = 0, y = 0,
    vx = 0, vy = 0,
    gravity = 0,
    rotationVelocity = 0,
    shrinkVelocity = 0) {

    super(textureFrames, x, y, vx, vy, 0, gravity, 0, rotationVelocity);

    if (size) {
      this.width = size;
      this.height = size;
    }

    if (this.totalFrames > 0) {
      this.gotoAndStop(randomInt(0, this.totalFrames - 1));
    }

    this.shrinkVelocity = shrinkVelocity;
    this.lifetime = lifetime;
    this.currentLifetime = 0;
  }

  updateCurrent(dt) {
    this.updatePosition(dt);
    this.updateRotation(dt);

    if (this.scale.x - this.shrinkVelocity * dt > 0) {
      this.scale.x -= this.shrinkVelocity * dt;
    }
    if (this.scale.y - this.shrinkVelocity * dt > 0) {
      this.scale.y -= this.shrinkVelocity * dt;
    }

    this.alpha = 1 - this.currentLifetime / this.lifetime;
    this.currentLifetime += dt;
  }
}
