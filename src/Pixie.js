import Entity from './Entity.js';

import { worldGravity, wingPower } from './const/gameConstants.js';

export default class Pixie extends Entity {
  constructor(textureFrames, x, y) {
    super(textureFrames, x, y, 0, 0, 0, worldGravity);

    this.animationSpeed = 0.4;
  }

  flapWings() {
    this.ay = worldGravity + wingPower;
    this.play();
  }

  stopFlapping() {
    this.ay = worldGravity;
    this.gotoAndStop(0);
  }
}
