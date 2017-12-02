import { BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class HintState extends State {
  constructor(stage, stateStack, message) {
    super(stage, stateStack);

    this.createText(message);

    this.keyControllers.push(new KeyBinder(32, null, () => {
      this.popFromStack();
    }));
  }

  createText(message) {
    let messageText = new BitmapText(message, {font: '64px pixie-font'});
    messageText.anchor.x = 0.5;
    this.container.addChild(messageText);

    this.container.x = RENDERER_WIDTH / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }
}
