import { Graphics } from '../const/aliases.js';

import Light from './Light.js';

export default class Night extends Graphics {
  constructor(sizeX, sizeY, centerX, centerY) {
    super();

    this.beginFill(0x000d23);
    this.drawRect(0, 0, sizeX, sizeY);
    this.endFill();

    this.light = new Light(sizeX, sizeY);
    this.renderGradient(centerX, centerY);
    this.mask = this.light.sprite;
  }

  renderGradient(centerX, centerY) {
    this.light.renderGradient(centerX, centerY)
  }
}
