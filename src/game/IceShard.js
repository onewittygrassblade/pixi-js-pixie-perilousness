import Entity from './Entity';
import { randomFloat } from '../helpers/RandomNumbers';

export default class IceShard extends Entity {
  constructor(textureFrames, x, y) {
    super(
      textureFrames,
      x,
      y,
      randomFloat(-0.15, -0.22),
      randomFloat(0.15, 0.2), 0, 0
    );

    this.anchor.set(0.5, 0.5);
    this.rotation = randomFloat(0, 6.28);
  }

  updateCurrent(dt) {
    this.updatePosition(dt);
  }
}
