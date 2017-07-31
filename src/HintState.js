import KeyBinder from './KeyBinder.js';

import { BitmapText } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class HintState {
  constructor(stage, stateStack, parent, level, message) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.parent = parent;

    this.parent.removeKeyControllers();
    this.parent.world.removeKeyControllers();

    this.createText(level, message);

    this.addKeyControllers();
  }

  createText(level, message) {
    let levelText = new BitmapText(
      'Level ' + level,
      {font: '64px pixie-font'}
    );
    levelText.x = rendererWidth / 2 - levelText.width / 2;
    levelText.y = rendererHeight / 2 - levelText.height / 2 - 40;
    this.stage.addChild(levelText);

    let messageText = new BitmapText(
      message,
      {font: '48px pixie-font'}
    );
    messageText.x = rendererWidth / 2 - messageText.width / 2;
    messageText.y = levelText.y + 100;
    this.stage.addChild(messageText);
  }

  addKeyControllers() {
    let startGame = () => {
      this.startGameController.remove();

      this.parent.addKeyControllers();
      this.parent.world.addKeyControllers();

      this.stage.removeChildren(this.stage.children.length - 2, this.stage.children.length);

      this.stateStack.pop();
    }

    this.startGameController = new KeyBinder(32, null, startGame);
  }

  update(dt) {
    return false;
  }
}
