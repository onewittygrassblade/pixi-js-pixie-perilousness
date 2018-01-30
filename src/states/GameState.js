import State from './State.js';
import HintState from './HintState.js';
import PauseState from './PauseState.js';
import GameOverState from './GameOverState.js';
import World from '../game/World.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { LEVELS_DATA } from '../const/levelsData.js';

export default class GameState extends State {
  constructor(stage, stateStack, textures, sounds) {
    super(stage, stateStack, textures, sounds)

    this.currentLevel = 0;

    this.keyControllers.push(new KeyBinder(27, null, () => {
      this.stateStack.push(new PauseState(this.stage, this.stateStack, this.textures));
    }));

    this.world = new World(this.container, textures, sounds, LEVELS_DATA[0].world);
  }

  addEventListeners() {
    super.addEventListeners();
    this.world.addEventListeners();
  }

  removeEventListeners() {
    super.removeEventListeners();
    this.world.removeEventListeners();
  }

  update(dt) {
    this.world.update(dt);

    if (this.world.pixieHasCrashed) {
      if (this.world.hasLives()) {
        this.world.resetAfterCrash();
        this.stateStack.push(new HintState(this.stage, this.stateStack, LEVELS_DATA[this.currentLevel].hint));
      } else {
        this.gameOver(false);
      }
    }

    if (this.world.pixieHasReachedEnd) {
      this.currentLevel++;
      this.sounds.tada.play();

      if (this.currentLevel < LEVELS_DATA.length) {
        this.world.levelData = LEVELS_DATA[this.currentLevel].world;
        this.world.resetForNextLevel();
        if (this.currentLevel === LEVELS_DATA.length - 1) {
          this.world.setFinishTextForFinalLevel();
        }
        this.stateStack.push(new HintState(this.stage, this.stateStack, LEVELS_DATA[this.currentLevel].hint));
      } else {
        this.gameOver(true);
      }
    }

    return false;
  }

  gameOver(success) {
    this.popFromStack();
    this.stateStack.push(new GameOverState(this.stage, this.stateStack, this.textures, this.sounds, success));
  }
}
