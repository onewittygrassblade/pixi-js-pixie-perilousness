import Emitter from './Emitter.js';

import { randomInt } from '../helpers/RandomNumbers.js';

export default class SpatialEmitter extends Emitter {
  constructor(
    textureFrames,
    minSize,
    maxSize,
    minX, maxX,
    minY, maxY,
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
    super(
      textureFrames,
      minSize,
      maxSize,
      minInitialSpeed,
      maxInitialSpeed,
      minGravity,
      maxGravity,
      minRotationVelocity,
      maxRotationVelocity,
      minShrinkVelocity,
      maxShrinkVelocity,
      minLifetime,
      maxLifetime,
      minDirectionAngle,
      maxDirectionAngle,
      randomSpacing,
      emitting,
      emissionRate,
      numberOfParticlesPerEmit
    );

    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }

  burst(numberOfParticles) {
    super.burst(
      numberOfParticles,
      randomInt(this.minX, this.maxX),
      randomInt(this.minY, this.maxY)
    );
  }
}
