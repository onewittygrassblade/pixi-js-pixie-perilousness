import { AnimatedSprite } from './const/aliases.js';

import { playerStartX, playerStartY } from './const/gameConstants.js';

export default class Pixie extends AnimatedSprite {
  constructor(frames) {
    super(frames);

    this.animationSpeed = 0.4;

    this.x = playerStartX;
    this.y = playerStartY;

    this.vy = 0;
  }
}
