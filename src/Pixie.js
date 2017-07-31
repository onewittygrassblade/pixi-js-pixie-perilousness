import Entity from './Entity.js';

export default class Pixie extends Entity {
  constructor(textureFrames, x, y, ay) {
    super(textureFrames, x, y, 0, 0, 0, ay);

    this.animationSpeed = 0.4;

    this.wingPower = -0.001;
  }
}
