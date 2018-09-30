import { GlowFilter } from '@pixi/filter-glow';

export default class Clickable {
  static setup(item, callback) {
    item.interactive = true;

    /* eslint-disable no-multi-spaces */
    const glowFilter = new GlowFilter(
      12,       // distance
      2,        // outerStrength
      1,        // innerStrength
      0xff9999, // color
      0.5,      // quality
    );
    /* eslint-enable no-multi-spaces */

    item
      .on('mouseover', () => {
        item.filters = [glowFilter];
      })
      .on('mouseout', () => {
        item.filters = [];
      })
      .on('click', callback);
  }
}
