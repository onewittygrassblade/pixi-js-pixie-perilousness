import { GlowFilter } from '@pixi/filter-glow';

import { BitmapText } from '../const/aliases';

export default class MenuItem extends BitmapText {
  constructor(text, style) {
    super(text, style);

    this.anchor.x = 0.5;
    this.interactive = true;
    this.buttonMode = true;

    /* eslint-disable no-multi-spaces */
    const glowFilter = new GlowFilter(
      12,       // distance
      2,        // outerStrength
      1,        // innerStrength
      0xff9999, // color
      0.5,      // quality
    );
    /* eslint-enable no-multi-spaces */

    this.on('mouseover', () => {
      this.filters = [glowFilter];
    });

    this.on('mouseout', () => {
      this.filters = [];
    });
  }
}
