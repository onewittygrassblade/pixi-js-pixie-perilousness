import Entity from './Entity.js';
import { randomInt } from './helpers/RandomNumbers.js';

import { ParticleContainer } from './const/aliases.js';

export default class Particle extends Entity {
  constructor(textureFrames, size, x, y, vx, vy, gravity, rotationVelocity, shrinkVelocity, lifetime) {
    super(textureFrames, x, y, vx, vy, 0, gravity, 0, rotationVelocity);

    this.width = size;
    this.height = size;

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
