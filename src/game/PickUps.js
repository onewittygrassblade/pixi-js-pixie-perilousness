import { Container, Sprite } from '../const/aliases';
import { randomInt } from '../helpers/RandomNumbers';

import { RENDERER_HEIGHT } from '../const/appConstants';

import { NUM_PILLARS, PILLAR_SPACING, PICKUP_X_OFFSET } from '../const/worldData';

export default class PickUps extends Container {
  constructor(texture) {
    super();

    this.create(texture);
  }

  create(texture) {
    for (let i = 0; i < NUM_PILLARS; i++) {
      const pickUp = new Sprite(texture);
      pickUp.x = i * PILLAR_SPACING + PICKUP_X_OFFSET;
      this.addChild(pickUp);
    }
  }

  randomizeYPositions() {
    this.children.forEach((pickUp) => {
      pickUp.y = randomInt(50, RENDERER_HEIGHT - 50);
    });
  }

  reset() {
    this.children.forEach((pickUp) => {
      pickUp.visible = true;
    });
    this.randomizeYPositions();
  }
}
