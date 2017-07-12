import GameState from './GameState.js';
import KeyBinder from './KeyBinder.js';

import { Text } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class TitleState {
  constructor(stage, stateStack, textures) {    
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.createText();

    this.initializeKeys();
  }

  createText() {
    this.text = new Text(
      'Hit Enter\nto start',
      {
        fontSize: 60,
        fill : 0xe6007e,
        align : 'center'
      }
    );

    this.text.x = rendererWidth / 2 - this.text.width / 2;
    this.text.y = rendererHeight / 2 - this.text.height / 2;

    this.stage.addChild(this.text);
  }

  initializeKeys() {
    let enterPressCallback = undefined;

    let enterReleaseCallback = () => {
      this.enterController.remove();

      this.stage.removeChild(this.text);

      this.stateStack.pop();
      this.stateStack.push(new GameState(this.stage, this.stateStack, this.textures));
    }

    this.enterController = new KeyBinder(13, enterPressCallback, enterReleaseCallback);
  }

  update(dt) {
    return false;
  }
}
