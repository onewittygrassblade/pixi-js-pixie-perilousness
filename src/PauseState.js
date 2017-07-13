import KeyBinder from './KeyBinder.js';

import { Text } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

export default class PauseState {
  constructor(stage, stateStack, textures, world) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.gameWorld = world;

    this.gameWorld.removeKeyControllers();

    this.createText();

    this.addKeyControllers();
  }

  createText() {
    this.text = new Text(
      'Game paused',
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

  addKeyControllers() {
    let leavePauseState = () => {
      this.leavePauseStateController.remove();
      this.gameWorld.addKeyControllers();
      this.stage.removeChild(this.text);
      this.stateStack.pop();
    }

    this.leavePauseStateController = new KeyBinder(27, null, leavePauseState);
  }

  update(dt) {
    return false;
  }
}
