import { AnimatedSprite } from './const/aliases.js';

import { playerStartX, playerStartY, gravity, wingPower } from './const/gameConstants.js';

export default class Pixie extends AnimatedSprite {
  constructor(frames) {
    super(frames);

    this.animationSpeed = 0.4;

    this.x = playerStartX;
    this.y = playerStartY;

    this.vy = 0;
    this.ay = gravity;
  }

  flapWings() {
    this.ay = gravity + wingPower;
  }

  stopFlapping() {
    this.ay = gravity;
  }
}
