import World from './World.js';
import HintState from './HintState.js';
import PauseState from './PauseState.js';
import GameOverState from './GameOverState.js';
import KeyBinder from './KeyBinder.js';

import { levelsData } from './const/levelsData.js'

export default class GameState {
  constructor(stage, stateStack, textures, sounds) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.sounds = sounds;

    this.currentLevel = 0;
    this.numberOfLives = 3;
    this.numberOfTeddyBears = 0;

    this.world = new World(stage, textures, sounds, this);

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
      if (this.numberOfLives > 1) {
        this.world.numberOfTeddyBears = this.numberOfTeddyBears;
        this.world.resetScene();
        this.world.resetEmitter();
        this.world.decreaseNumberOfLives();
        this.world.pixie.visible = true;
        this.world.hasAlivePlayer = true;
        this.world.gameOver = false;
        this.stateStack.push(new HintState(this.stage, this.stateStack, this, this.currentLevel+1, levelsData[this.currentLevel].hintData));
        this.numberOfLives--;
      }
      else {
        this.stage.removeChildren(1, this.stage.children.length);
        this.pauseGameController.remove();
        this.stateStack.pop();
        this.stateStack.push(new GameOverState(this.stage, this.stateStack, this.textures, false));
      }
    }

    if (this.world.pixieHasReachedEnd) {
      this.currentLevel++;

      if (this.currentLevel < levelsData.length) {
        this.world.resetScene();
        this.numberOfTeddyBears = this.world.numberOfTeddyBears;
        this.world.pixieHasReachedEnd = false;
        this.stateStack.push(new HintState(this.stage, this.stateStack, this, this.currentLevel+1, levelsData[this.currentLevel].hintData));
      } else {
        this.stage.removeChildren(1, this.stage.children.length);
        this.pauseGameController.remove();
        this.stateStack.pop();
        this.stateStack.push(new GameOverState(this.stage, this.stateStack, this.textures, true));
      }
    }

    return false;
  }
}
