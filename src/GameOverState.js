import GameState from './GameState.js';
import HintState from './HintState.js';
import KeyBinder from './KeyBinder.js';

import { TilingSprite, BitmapText } from './const/aliases.js';

import { rendererWidth, rendererHeight, levelsData } from './const/gameConstants.js';

export default class GameOverState {
  constructor(stage, stateStack, textures, success) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.buildScene(success);

    this.addKeyControllers();
  }

  buildScene(success) {
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

      this.stage.removeChildren(1, this.stage.children.length);

      this.stateStack.pop();
      let gameState = new GameState(this.stage, this.stateStack, this.textures);
      this.stateStack.push(gameState);
      this.stateStack.push(new HintState(this.stage, this.stateStack, gameState, 1, levelsData[0].hintData));
    }

    this.restartGameController = new KeyBinder(32, null, restartGame);
  }

  update(dt) {
    return false;
  }
}
