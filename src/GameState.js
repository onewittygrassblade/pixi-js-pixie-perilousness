import World from './World.js';
import TitleState from './TitleState.js';

export default class GameState {
  constructor(stage, stateStack, textures) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.world = new World(stage, textures);
  }

  update(dt) {
    this.world.update(dt);

    if (!this.world.hasAlivePlayer) {
      this.stateStack.pop();
      this.stateStack.push(new TitleState(this.stage, this.stateStack, this.textures));
    }

    return true;
  }
}
