import { Graphics } from '../const/aliases.js';

export default class Night extends Graphics {
  constructor(size) {
    super();
    this.beginFill(0x000d23);
    this.drawRect(0, 0, size.x, size.y);
    this.endFill();
  }
}
