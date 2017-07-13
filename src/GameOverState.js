import TitleState from './TitleState.js';
import KeyBinder from './KeyBinder.js';

import { Text, TextStyle } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class GameOverState {
  constructor(stage, stateStack, textures, success) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.createText(success);

    this.addKeyControllers();
  }

  createText(success) {
    let style = new TextStyle({
      fontSize: 60,
      fontWeight: 'bold',
      fill : 0xe6007e,
      align : 'center'
    });

    if (success) {
      this.text = new Text('Success!', style);
    }
    else {
      this.text = new Text('Failure!', style);
    }

    this.text.x = rendererWidth / 2 - this.text.width / 2;
    this.text.y = rendererHeight / 2 - this.text.height / 2;

    this.stage.addChild(this.text);
  }

  addKeyControllers() {
    let continueToTitle = () => {
      this.continueToTitleController.remove();

      this.stage.removeChild(this.text);

      this.stateStack.pop();
      this.stateStack.push(new TitleState(this.stage, this.stateStack, this.textures));
    }

    this.continueToTitleController = new KeyBinder(13, null, continueToTitle);
  }

  update(dt) {
    return false;
  }
}
