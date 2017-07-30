import GameState from './GameState.js';
import KeyBinder from './KeyBinder.js';

import { TilingSprite, BitmapText } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class GameOverState {
  constructor(stage, stateStack, textures, success) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.buildScene(success);

    this.addKeyControllers();
  }

  buildScene(success) {
    let sky = new TilingSprite(this.textures['clouds.png'], rendererWidth, rendererHeight);
    this.stage.addChild(sky);

    let message = new BitmapText(
      'Whoops!',
      {font: '96px pixie-font'}
    );

    if (success) {
      message.text = 'Yay!';
    }

    message.x = rendererWidth / 2 - message.width / 2;
    message.y = rendererHeight / 2 - message.height / 2;

    this.stage.addChild(message);
  }

  addKeyControllers() {
    let restartGame = () => {
      this.restartGameController.remove();

      this.stage.removeChildren();

      this.stateStack.pop();
      this.stateStack.push(new GameState(this.stage, this.stateStack, this.textures));
    }

    this.restartGameController = new KeyBinder(32, null, restartGame);
  }

  update(dt) {
    return false;
  }
}
