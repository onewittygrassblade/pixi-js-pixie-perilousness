import { BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class PauseState extends State {
  constructor(stage, stateStack, textures, parent) {
    super(stage, stateStack, textures, null, parent);

    this.createText();
    this.addKeyControllers();
  }

  createText() {
    let message = new BitmapText(
      'Game paused',
      {font: '72px pixie-font'}
    );
    message.x = RENDERER_WIDTH / 2 - message.width / 2;
    message.y = RENDERER_HEIGHT / 2 - message.height / 2 - 40;
    this.container.addChild(message);

    let hint = new BitmapText(
      'Press ESC to resume',
      {font: '48px pixie-font'}
    );
    hint.x = RENDERER_WIDTH / 2 - hint.width / 2;
    hint.y = message.y + 100;
    this.container.addChild(hint);
  }

  addKeyControllers() {
    let leavePauseState = () => {
      this.leavePauseStateController.remove();

      this.parent.addKeyControllers();
      this.parent.world.addKeyControllers();

      this.popFromStack();
    }

    this.leavePauseStateController = new KeyBinder(27, null, leavePauseState);
  }
}
