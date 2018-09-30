import { BitmapText } from '../const/aliases';
import Clickable from './Clickable';

export default class MenuItem extends BitmapText {
  constructor(text, style, callback) {
    super(text, style);

    this.anchor.x = 0.5;
    Clickable.setup(this, callback);
  }
}
