import { BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class PauseState extends State {
  constructor(stage, stateStack, textures, parent) {
    super(stage, stateStack, textures, null, parent);

    this.createTexts();

    this.keyControllers.push(new KeyBinder(27, null, () => {
      this.popFromStack();
    }));
  }

  createTexts() {
    let messageText = new BitmapText('Game paused', {font: '64px pixie-font'});
    messageText.anchor.x = 0.5;
    this.container.addChild(messageText);

    let hintText = new BitmapText('Press ESC to resume', {font: '32px pixie-font'});
    hintText.anchor.x = 0.5;
    hintText.y = messageText.y + messageText.height + 40;
    this.container.addChild(hintText);

    this.container.x = RENDERER_WIDTH / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }
}
