import Emitter from './Emitter';

export default class PointEmitter extends Emitter {
  constructor(
    textureFrames,
    minSize,
    maxSize,
    parent,
    offsetX = 0,
    offsetY = 0,
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

    this.parent = parent;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  burst(numberOfParticles) {
    super.burst(numberOfParticles, this.parent.x + this.offsetX, this.parent.y + this.offsetY);
  }
}
