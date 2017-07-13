import GameState from './GameState.js';
import KeyBinder from './KeyBinder.js';

import { Sprite, TilingSprite } from './const/aliases.js';

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
    let sky = new TilingSprite(this.textures["clouds.png"], rendererWidth, rendererHeight);
    this.stage.addChild(sky);

    let message = new Sprite();

    if (success) {
      message.texture = this.textures["yay.png"];
    }
    else {
      message.texture = this.textures["whoops.png"];
    }

    message.x = rendererWidth / 2 - message.width / 2;
    message.y = rendererHeight / 2 - message.height / 2 - 100;

    this.stage.addChild(message);

    let hint = new Sprite(this.textures["space_to_restart.png"]);
    hint.x = rendererWidth / 2 - hint.width / 2;
    hint.y = message.y + 200;
    this.stage.addChild(hint);
  }

  addKeyControllers() {
    let restartGame = () => {
      this.restartGameController.remove();

      while (this.stage.children[0]) {
        this.stage.removeChild(this.stage.children[0]);
      }

      this.stateStack.pop();
      this.stateStack.push(new GameState(this.stage, this.stateStack, this.textures));
    }

    this.restartGameController = new KeyBinder(32, null, restartGame);
  }

  update(dt) {
    return false;
  }
}
