import KeyBinder from './KeyBinder.js';

import { BitmapText } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class PauseState {
  constructor(stage, stateStack, textures, parent) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.parent = parent;

    this.parent.world.removeKeyControllers();

    this.createText();

    this.addKeyControllers();
  }

  createText() {
    let message = new BitmapText(
      'Game paused',
      {font: '72px pixie-font'}
    );
    message.x = rendererWidth / 2 - message.width / 2;
    message.y = rendererHeight / 2 - message.height / 2 - 40;
    this.stage.addChild(message);

    let hint = new BitmapText(
      'Press ESC to resume',
      {font: '48px pixie-font'}
    );
    hint.x = rendererWidth / 2 - hint.width / 2;
    hint.y = message.y + 100;
    this.stage.addChild(hint);
  }

  addKeyControllers() {
    let leavePauseState = () => {
      this.leavePauseStateController.remove();

      this.parent.addKeyControllers();
      this.parent.world.addKeyControllers();

      this.stage.removeChildren(this.stage.children.length - 2, this.stage.children.length);

      this.stateStack.pop();
    }

    this.leavePauseStateController = new KeyBinder(27, null, leavePauseState);
  }

  update(dt) {
    return false;
  }
}
