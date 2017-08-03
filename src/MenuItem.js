import { BitmapText } from './const/aliases.js';

import {GlowFilter} from '@pixi/filter-glow';

export default class MenuItem extends BitmapText {
  constructor(text, style) {
    super(text, style);

    this.anchor.x = 0.5;

    this.interactive = true;
    this.buttonMode = true;

    let glowFilter = new GlowFilter(15, 2, 1, 0xff9999, 0.5);

    this.on('mouseover', e => {
      this.filters = [ glowFilter ];
    });

    this.on('mouseout', e => {
      this.filters = [];
    });
  }
}
