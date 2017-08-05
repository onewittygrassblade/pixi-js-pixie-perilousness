import KeyBinder from './KeyBinder.js';

import { Container, BitmapText } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/appConstants.js';

export default class HintState {
  constructor(stage, stateStack, parent, level, message) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.parent = parent;

    this.parent.removeKeyControllers();
    this.parent.world.removeKeyControllers();

    this.createTexts(level, message);

    this.addKeyControllers();
  }

  createTexts(level, message) {
    let textContainer = new Container();
    textContainer.x = rendererWidth / 2;

    let levelText = new BitmapText(
      'Level ' + level,
      {font: '64px pixie-font'}
    );
    levelText.anchor.x = 0.5;
    textContainer.addChild(levelText);

    let messageText = new BitmapText(
      message,
      {font: '48px pixie-font'}
    );
    messageText.anchor.x = 0.5;
    messageText.y = levelText.y + levelText.height + 40;
    textContainer.addChild(messageText);

    textContainer.y = rendererHeight / 2 - textContainer.height / 2;
    this.stage.addChild(textContainer);
  }

  addKeyControllers() {
    let startGame = () => {
      this.startGameController.remove();

      this.parent.addKeyControllers();
      this.parent.world.addKeyControllers();

      this.stage.removeChildAt(this.stage.children.length - 1);

      this.stateStack.pop();
    }

    this.startGameController = new KeyBinder(32, null, startGame);
  }

  update(dt) {
    return false;
  }
}
