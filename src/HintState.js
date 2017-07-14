import KeyBinder from './KeyBinder.js';

import { Sprite } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class HintState {
  constructor(stage, stateStack, textures, parent) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.parent = parent;

    this.parent.removeKeyControllers();
    this.parent.world.removeKeyControllers();

    this.buildScene();

    this.addKeyControllers();
  }

  buildScene() {
    this.hintTop = new Sprite(this.textures["press_space_to_make.png"]);
    this.hintTop.x = rendererWidth / 2 - this.hintTop.width / 2;
    this.hintTop.y = rendererHeight / 2 - this.hintTop.height / 2 - 100;
    this.stage.addChild(this.hintTop);

    this.hintBottom = new Sprite(this.textures["pixie_flap_her_wings.png"]);
    this.hintBottom.x = rendererWidth / 2 - this.hintBottom.width / 2;
    this.hintBottom.y = this.hintTop.y + 100;
    this.stage.addChild(this.hintBottom);
  }

  addKeyControllers() {
    let startGame = () => {
      this.startGameController.remove();

      this.parent.addKeyControllers();
      this.parent.world.addKeyControllers();

      this.stage.removeChild(this.hintTop);
      this.stage.removeChild(this.hintBottom);

      this.stateStack.pop();
    }

    this.startGameController = new KeyBinder(32, null, startGame);
  }

  update(dt) {
    return false;
  }
}
