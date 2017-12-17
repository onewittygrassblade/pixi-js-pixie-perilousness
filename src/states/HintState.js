import { BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class HintState extends State {
  constructor(stage, stateStack, message) {
    super(stage, stateStack);

    this.createTexts(message);

    this.keyControllers.push(new KeyBinder(32, null, () => {
      this.popFromStack();
    }));
  }

  createTexts(message) {
    const messageText = new BitmapText(message, {font: '64px pixie-font'});
    messageText.anchor.x = 0.5;
    this.container.addChild(messageText);

    const hintText = new BitmapText('Press space to start', {font: '40px pixie-font'});
    hintText.anchor.x = 0.5;
    hintText.y = messageText.y + messageText.height + 40;
    this.container.addChild(hintText);

    this.container.x = RENDERER_WIDTH / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }
}
