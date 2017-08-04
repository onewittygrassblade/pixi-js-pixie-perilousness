import World from './World.js';
import HintState from './HintState.js';
import PauseState from './PauseState.js';
import GameOverState from './GameOverState.js';
import KeyBinder from './KeyBinder.js';

import { levelsData } from './const/gameConstants.js';

export default class GameState {
  constructor(stage, stateStack, textures) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.currentLevel = 0;
    this.numberOfLives = 3;
    this.world = new World(stage, textures, levelsData[0].worldData, 3);

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
        this.world.levelData = levelsData[this.currentLevel].worldData;
        this.world.resetScene();
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
