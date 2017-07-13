import KeyBinder from './KeyBinder.js';

import { Sprite, TilingSprite } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class PauseState {
  constructor(stage, stateStack, textures, parent) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.parent = parent;

    this.parent.world.removeKeyControllers();

    this.buildScene();

    this.addKeyControllers();
  }

  buildScene() {
    this.title = new Sprite(this.textures["game_paused.png"]);
    this.title.x = rendererWidth / 2 - this.title.width / 2;
    this.title.y = rendererHeight / 2 - this.title.height / 2 - 100;
    this.stage.addChild(this.title);

    this.hint = new Sprite(this.textures["esc_to_continue.png"]);
    this.hint.x = rendererWidth / 2 - this.hint.width / 2;
    this.hint.y = this.title.y + 200;
    this.stage.addChild(this.hint);
  }

  addKeyControllers() {
    let leavePauseState = () => {
      this.leavePauseStateController.remove();

      this.parent.addKeyControllers();
      this.parent.world.addKeyControllers();

      this.stage.removeChild(this.title);
      this.stage.removeChild(this.hint);

      this.stateStack.pop();
    }

    this.leavePauseStateController = new KeyBinder(27, null, leavePauseState);
  }

  update(dt) {
    return false;
  }
}
