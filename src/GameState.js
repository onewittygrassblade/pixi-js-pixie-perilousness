import World from './World.js';
import PauseState from './PauseState.js';
import GameOverState from './GameOverState.js';
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

  removeKeyControllers() {
    this.pauseGameController.remove();
  }

  update(dt) {
    this.world.update(dt);

    if (!this.world.hasAlivePlayer) {
      this.stage.removeChildren();
      this.pauseGameController.remove();
      this.stateStack.pop();
      this.stateStack.push(new GameOverState(this.stage, this.stateStack, this.textures, false));
    }

    if (this.world.pixieHasReachedEnd) {
      this.stage.removeChildren();
      this.pauseGameController.remove();
      this.stateStack.pop();
      this.stateStack.push(new GameOverState(this.stage, this.stateStack, this.textures, true));
    }

    return false;
  }
}
