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

  show() {
    this.container.visible = true;
  }

  // this method can be overwritten to set the container's visibility to false
  // if the state is not to be rendered when not on top of the stack
  toggleVisibility() {
    this.container.visible = true;
  }

  popFromStack() {
    this.stage.removeChild(this.container);
    this.stateStack.pop();
  }

  update(dt) {
    return false;
  }
}
