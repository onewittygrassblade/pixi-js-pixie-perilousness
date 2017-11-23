import { Container } from '../const/aliases.js';

export default class State {
  constructor(stage, stateStack, textures = null, sounds = null, parent = null) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.sounds = sounds;
    this.parent = parent;

    this.container = new Container();
    this.stage.addChild(this.container);
  }

  pop() {
    this.stage.removeChild(this.container);
    this.stateStack.pop();
  }

  update(dt) {
    return false;
  }
}
