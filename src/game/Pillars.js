import { Container, Sprite } from '../const/aliases.js';
import { randomInt } from '../helpers/RandomNumbers.js';

import { NUM_PILLARS,
         BLOCK_WIDTH,
         BLOCK_HEIGHT,
         PILLAR_SPACING,
         PILLAR_HEIGHT,
         MAX_GAP_SIZE,
         GAP_REDUCTION_FREQUENCY,
         PILLAR_SLIDING_SPEED } from '../const/worldData.js';

export default class Pillars extends Container {
  constructor(texture) {
    super();

    this.create(texture);
  }

  create(texture) {
    let gapSize = MAX_GAP_SIZE;

    for (let i = 0; i < NUM_PILLARS; i++) {
      let pillar = new Container();
      this.addChild(pillar);
      pillar.x = i * PILLAR_SPACING;
      pillar.gapSize = gapSize;

      // All pillars are made taller than the screen to allow sliding
      for (let j = 0; j < PILLAR_HEIGHT - gapSize; j++) {
        let upperBlock = new Sprite(texture);
        upperBlock.y = j * BLOCK_HEIGHT;
        pillar.addChild(upperBlock);

        let lowerBlock = new Sprite(texture);
        lowerBlock.y = (j + PILLAR_HEIGHT) * BLOCK_HEIGHT;
        pillar.addChild(lowerBlock);
      }

      if (i > 0 && i % GAP_REDUCTION_FREQUENCY === 0) {
        gapSize--;
      }
    }
  }

  randomizeYPositions() {
    for (let pillar of this.children) {
      pillar.y = randomInt(0, PILLAR_HEIGHT - pillar.gapSize) * BLOCK_HEIGHT * -1;
    }
  }

  randomizeYSpeeds() {
    for (let pillar of this.children) {
      pillar.vy = PILLAR_SLIDING_SPEED * (Math.random() < 0.5 ? -1 : 1);
    }
  }

  slide(dt) {
    for (let pillar of this.children) {
      pillar.y += pillar.vy * dt;

      if (pillar.y > 0 || pillar.y < (PILLAR_HEIGHT - pillar.gapSize) * BLOCK_HEIGHT * -1) {
        pillar.vy *= -1;
      }
    }
  }

  reset() {
    for (let pillar of this.children) {
      for (let block of pillar.children) {
        block.visible = true;
      }
    }
    this.randomizeYPositions();
    this.randomizeYSpeeds();
  }
}
