import GameState from './GameState.js';
import KeyBinder from './KeyBinder.js';

import { Sprite, TilingSprite } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class TitleState {
  constructor(stage, stateStack, textures) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.buildScene();

    this.addKeyControllers();
  }

  buildScene() {
    let sky = new TilingSprite(this.textures["clouds.png"], rendererWidth, rendererHeight);
    this.stage.addChild(sky);

    let title = new Sprite(this.textures["title.png"]);
    title.x = rendererWidth / 2 - title.width / 2;
    title.y = rendererHeight / 2 - title.height / 2 - 100;
    this.stage.addChild(title);

    let hint = new Sprite(this.textures["press_space_to_start.png"]);
    hint.x = rendererWidth / 2 - hint.width / 2;
    hint.y = title.y + 200;
    this.stage.addChild(hint);
  }

  addKeyControllers() {
    let startGame = () => {
      this.startGameController.remove();

      while (this.stage.children[0]) {
        this.stage.removeChild(this.stage.children[0]);
      }

      this.stateStack.pop();
      this.stateStack.push(new GameState(this.stage, this.stateStack, this.textures));
    }

    this.startGameController = new KeyBinder(32, null, startGame);
  }

  update(dt) {
    return false;
  }
}
