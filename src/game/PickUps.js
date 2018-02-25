import { Container, Sprite } from '../const/aliases.js';
import { randomInt } from '../helpers/RandomNumbers.js';

import { RENDERER_HEIGHT } from '../const/appConstants.js';

import { NUM_PILLARS,
         PILLAR_SPACING,
         PICKUP_X_OFFSET } from '../const/worldData.js';

export default class PickUps extends Container {
  constructor(texture) {
    super();

    this.create(texture);
  }

  create(texture) {
    for (let i = 0; i < NUM_PILLARS; i++) {
      let pickUp = new Sprite(texture);
      pickUp.x = i * PILLAR_SPACING + PICKUP_X_OFFSET;
      this.addChild(pickUp);
    }
  }

  randomizeYPositions() {
    for (let pickUp of this.children) {
      pickUp.y = randomInt(50, RENDERER_HEIGHT - 50);
    }
  }

  reset() {
    for (let pickUp of this.children) {
      pickUp.visible = true;
    }
    this.randomizeYPositions();
  }
}
