import KeyBinder from './KeyBinder.js';

import { BitmapText } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class HintState {
  constructor(stage, stateStack, textures, parent) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.parent = parent;

    this.parent.removeKeyControllers();
    this.parent.world.removeKeyControllers();

    this.createText();

    this.addKeyControllers();
  }

  createText() {
    let text = new BitmapText(
      'Press space to make Pixie flap her wings!',
      {font: '64px pixie-font', align: 'center'}
    );

    text.maxWidth = 480;
    text.x = rendererWidth / 2 - text.width / 2;
    text.y = rendererHeight / 2 - text.height / 2;

    this.stage.addChild(text);
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
