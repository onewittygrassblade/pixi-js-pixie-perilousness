import IceShard from './IceShard';
import { randomFloat } from '../helpers/RandomNumbers';

import { RENDERER_WIDTH } from '../const/app';

export default class IceShardsManager {
  constructor(container, textureFrames, frequency) {
    this.container = container;
    this.textureFrames = textureFrames;
    this.frequency = frequency;

    this.timer = 0;
    this.iceShards = [];
  }

  update(dt) {
    this.timer += dt;

    this.iceShards.forEach((iceShard) => {
      iceShard.updateCurrent(dt);
    });

    if (this.timer > this.frequency) {
      const iceShard = new IceShard(
        this.textureFrames,
        randomFloat(RENDERER_WIDTH / 2, 3 * (RENDERER_WIDTH / 4)),
        0
      );
      this.iceShards.push(iceShard);
      this.container.addChild(iceShard);
      this.timer = 0;
    }
  }

  reset() {
    this.iceShards.forEach((iceShard) => {
      this.container.removeChild(iceShard);
    });
    this.iceShards = [];
    this.timer = 0;
  }
}
