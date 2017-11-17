export default class State {
  constructor(stage, stateStack, textures = null, sounds = null, parent = null) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.sounds = sounds;
    this.parent = parent;
  }

  update(dt) {
    return false;
  }
}
