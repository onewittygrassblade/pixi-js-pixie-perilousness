import { BitmapText } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH, RENDERER_HEIGHT, FONTS } from '../const/app';

export default class PauseState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createTexts();
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 27) {
      this.stateStack.popState();
    }

    return false;
  }

  createTexts() {
    const messageText = new BitmapText('Game paused', { font: FONTS.medium });
    messageText.anchor.x = 0.5;
    this.container.addChild(messageText);

    const hintText = new BitmapText('Press ESC to resume', { font: FONTS.xsmall });
    hintText.anchor.x = 0.5;
    hintText.y = messageText.y + messageText.height + 40;
    this.container.addChild(hintText);

    this.container.x = RENDERER_WIDTH / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }
}
