import { BitmapText } from '../const/aliases.js';

import { GlowFilter } from '@pixi/filter-glow';

export default class MenuItem extends BitmapText {
  constructor(text, style) {
    super(text, style);

    this.anchor.x = 0.5;
    this.interactive = true;
    this.buttonMode = true;

    const glowFilter = new GlowFilter(
      12,       // distance
      2,        // outerStrength
      1,        // innerStrength
      0xff9999, // color
      0.5       // quality
    );

    this.on('mouseover', e => {
      this.filters = [ glowFilter ];
    });

    this.on('mouseout', e => {
      this.filters = [];
    });
  }
}
