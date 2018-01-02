import Emitter from '../particle/Emitter.js';

export default class PixieEmitter extends Emitter {
  constructor(parent, textureFrames) {
      super(
        parent,
        8,
        parent.height / 2,
        textureFrames,
        18,             // minSize
        24,             // maxSize
        0,              // minInitialSpeed
        0.1,            // maxInitialSpeed
        0.0001,         // minGravity
        0.0003,         // maxGravity
        -0.00628,       // minRotationVelocity
        0.00628,        // maxRotationVelocity
        0.0001,         // minShrinkVelocity
        0.0005,         // maxShrinkVelocity
        500,            // minLifetime
        2000,           // maxLifetime
        2.4,            // minDirectionAngle
        3.6,            // maxDirectionAngle
        true,           // randomSpacing
        false,          // emitting
        10,             // emissionRate
        3               // numberOfParticlesPerEmit
      );
    }
}
