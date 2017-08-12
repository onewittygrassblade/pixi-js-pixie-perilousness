import KeyBinder from '../helpers/KeyBinder.js';

import { Container, BitmapText } from '../const/aliases.js';

import { rendererWidth, rendererHeight } from '../const/appConstants.js';

export default class HintState {
  constructor(stage, stateStack, parent, message) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.parent = parent;

    this.parent.removeKeyControllers();
    this.parent.world.removeKeyControllers();

    this.createText(message);

    this.addKeyControllers();
  }

  createText(message) {
    let messageText = new BitmapText(message, {font: '64px pixie-font'});
    messageText.x = rendererWidth / 2 - messageText.width / 2;
    messageText.y = rendererHeight / 2 - messageText.height / 2;
    this.stage.addChild(messageText);
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
