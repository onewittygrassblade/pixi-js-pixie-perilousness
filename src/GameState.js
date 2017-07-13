import World from './World.js';
import TitleState from './TitleState.js';
import PauseState from './PauseState.js';
import KeyBinder from './KeyBinder.js';

export default class GameState {
  constructor(stage, stateStack, textures) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.world = new World(stage, textures);

    this.addKeyControllers();
  }

  addKeyControllers() {
    let pauseGame = () => {
      this.pauseGameController.remove();
      this.stateStack.push(new PauseState(this.stage, this.stateStack, this.textures, this.world));
    }

    this.pauseGameController = new KeyBinder(27, null, pauseGame);
  }

  update(dt) {
    this.world.update(dt);

    if (!this.world.hasAlivePlayer) {
      this.pauseGameController.remove();
      this.stateStack.pop();
      this.stateStack.push(new TitleState(this.stage, this.stateStack, this.textures));
    }

    return true;
  }
}
