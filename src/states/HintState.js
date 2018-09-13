import { BitmapText } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH, RENDERER_HEIGHT, FONTS } from '../const/app';
import LEVELS_DATA from '../const/levels';

export default class HintState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createTexts(LEVELS_DATA[context.level].hint);
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 32) {
      this.stateStack.popState();
    }

    return false;
  }

  createTexts(message) {
    const messageText = new BitmapText(message, { font: FONTS.medium });
    messageText.anchor.x = 0.5;
    this.container.addChild(messageText);

    const hintText = new BitmapText('Press space to start', { font: FONTS.xsmall });
    hintText.anchor.x = 0.5;
    hintText.y = messageText.y + messageText.height + 40;
    this.container.addChild(hintText);

    this.container.x = RENDERER_WIDTH / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }
}
