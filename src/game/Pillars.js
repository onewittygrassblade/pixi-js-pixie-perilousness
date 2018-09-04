import { Container, Sprite } from '../const/aliases';
import { randomInt } from '../helpers/RandomNumbers';

import {
  NUM_PILLARS,
  BLOCK_HEIGHT,
  PILLAR_SPACING,
  PILLAR_HEIGHT,
  MAX_GAP_SIZE,
  GAP_REDUCTION_FREQUENCY,
  PILLAR_SLIDING_SPEED
} from '../const/worldData';

export default class Pillars extends Container {
  constructor(texture) {
    super();

    this.create(texture);
  }

  create(texture) {
    let gapSize = MAX_GAP_SIZE;

    for (let i = 0; i < NUM_PILLARS; i++) {
      const pillar = new Container();
      this.addChild(pillar);
      pillar.x = i * PILLAR_SPACING;
      pillar.gapSize = gapSize;

      // All pillars are made taller than the screen to allow sliding
      for (let j = 0; j < PILLAR_HEIGHT - gapSize; j++) {
        const upperBlock = new Sprite(texture);
        upperBlock.y = j * BLOCK_HEIGHT;
        pillar.addChild(upperBlock);

        const lowerBlock = new Sprite(texture);
        lowerBlock.y = (j + PILLAR_HEIGHT) * BLOCK_HEIGHT;
        pillar.addChild(lowerBlock);
      }

      if (i > 0 && i % GAP_REDUCTION_FREQUENCY === 0) {
        gapSize--;
      }
    }
  }

  randomizeYPositions() {
    this.children.forEach((pillar) => {
      pillar.y = randomInt(0, PILLAR_HEIGHT - pillar.gapSize) * BLOCK_HEIGHT * -1;
    });
  }

  randomizeYSpeeds() {
    this.children.forEach((pillar) => {
      pillar.vy = PILLAR_SLIDING_SPEED * (Math.random() < 0.5 ? -1 : 1);
    });
  }

  slide(dt) {
    this.children.forEach((pillar) => {
      pillar.y += pillar.vy * dt;

      if (pillar.y > 0 || pillar.y < (PILLAR_HEIGHT - pillar.gapSize) * BLOCK_HEIGHT * -1) {
        pillar.vy *= -1;
      }
    });
  }

  reset() {
    this.children.forEach((pillar) => {
      pillar.children.forEach((block) => {
        block.visible = true;
      });
    });
    this.randomizeYPositions();
    this.randomizeYSpeeds();
  }
}
