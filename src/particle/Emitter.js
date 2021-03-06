import Particle from './Particle';
import ParticleSystem from './ParticleSystem';

import { randomInt, randomFloat } from '../helpers/RandomNumbers';

export default class Emitter {
  constructor(
    textureFrames,
    minSize,
    maxSize,
    minInitialSpeed = 0,
    maxInitialSpeed = 0,
    minGravity = 0,
    maxGravity = 0,
    minRotationVelocity = 0,
    maxRotationVelocity = 0,
    minShrinkVelocity = 0,
    maxShrinkVelocity = 0,
    minLifetime = 1000,
    maxLifetime = 1000,
    minDirectionAngle = 0,
    maxDirectionAngle = 6.28,
    randomSpacing = true,
    emitting = false,
    emissionRate = 30,
    numberOfParticlesPerEmit = 1
  ) {
    this.textureFrames = textureFrames;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.minInitialSpeed = minInitialSpeed;
    this.maxInitialSpeed = maxInitialSpeed;
    this.minGravity = minGravity;
    this.maxGravity = maxGravity;
    this.minRotationVelocity = minRotationVelocity;
    this.maxRotationVelocity = maxRotationVelocity;
    this.minShrinkVelocity = minShrinkVelocity;
    this.maxShrinkVelocity = maxShrinkVelocity;
    this.minLifetime = minLifetime;
    this.maxLifetime = maxLifetime;
    this.minDirectionAngle = minDirectionAngle;
    this.maxDirectionAngle = maxDirectionAngle;
    this.randomSpacing = randomSpacing;
    this.emitting = emitting;
    this.emissionPeriod = 1000 / emissionRate;
    this.accumulatedTime = 0;
    this.numberOfParticlesPerEmit = numberOfParticlesPerEmit;

    this.particleSystem = new ParticleSystem();
  }

  emit() {
    this.emitting = true;
  }

  stop() {
    this.emitting = false;
    this.accumulatedTime = 0;
  }

  burst(numberOfParticles, x, y) {
    let directionAngle;
    const directionAngleSpacing = (this.maxDirectionAngle - this.minDirectionAngle) / (numberOfParticles - 1); // eslint-disable-line max-len

    if (!this.randomSpacing) {
      directionAngle = this.minDirectionAngle;
    }

    for (let i = 0; i < numberOfParticles; i++) {
      if (this.randomSpacing) {
        directionAngle = randomFloat(this.minDirectionAngle, this.maxDirectionAngle);
      }

      const speed = randomFloat(this.minInitialSpeed, this.maxInitialSpeed);

      this.particleSystem.addParticle(new Particle(
        this.textureFrames,
        randomInt(this.minLifetime, this.maxLifetime),
        randomInt(this.minSize, this.maxSize),
        x, y,
        speed * Math.cos(directionAngle),
        speed * Math.sin(directionAngle) * -1.0,
        randomFloat(this.minGravity, this.maxGravity),
        randomFloat(this.minRotationVelocity, this.maxRotationVelocity),
        randomFloat(this.minShrinkVelocity, this.maxShrinkVelocity)
      ));

      if (!this.randomSpacing) {
        directionAngle += directionAngleSpacing;
      }
    }
  }

  update(dt) {
    if (this.emitting) {
      this.accumulatedTime += dt;

      while (this.accumulatedTime > this.emissionPeriod) {
        this.accumulatedTime -= this.emissionPeriod;
        this.burst(this.numberOfParticlesPerEmit);
      }
    }

    this.particleSystem.update(dt);
  }
}
