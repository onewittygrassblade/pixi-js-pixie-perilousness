import World from './World.js';
import GameOverState from './GameOverState.js';
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
      this.stateStack.push(new PauseState(this.stage, this.stateStack, this.textures, this));
    }

    this.pauseGameController = new KeyBinder(27, null, pauseGame);
  }

  update(dt) {
    this.world.update(dt);

    if (!this.world.hasAlivePlayer) {
      this.pauseGameController.remove();
      this.stateStack.pop();
      this.stateStack.push(new GameOverState(this.stage, this.stateStack, this.textures, false));
    }

    if (this.world.hasReachedEnd) {
      this.pauseGameController.remove();
      this.stateStack.pop();
      this.stateStack.push(new GameOverState(this.stage, this.stateStack, this.textures, true));
    }

    return true;
  }
}
