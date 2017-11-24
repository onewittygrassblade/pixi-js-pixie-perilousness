import State from './State.js';
import HintState from './HintState.js';
import PauseState from './PauseState.js';
import GameOverState from './GameOverState.js';
import World from '../game/World.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { NUMBER_OF_LEVELS } from '../const/gameData.js';

export default class GameState extends State {
  constructor(stage, stateStack, textures, sounds) {
    super(stage, stateStack, textures, sounds)

    this.currentLevel = 0;
    this.numberOfLives = 3;
    this.numberOfTeddyBears = 0;

    this.world = new World(stage, this.container, textures, sounds, this);

    this.addKeyControllers();
  }

  addKeyControllers() {
    let pauseGame = () => {
      this.removeKeyControllers();
      this.world.removeKeyControllers();
      this.stateStack.push(new PauseState(this.stage, this.stateStack, this.textures, this));
    }

    this.pauseGameController = new KeyBinder(27, null, pauseGame);
  }

  removeKeyControllers() {
    this.pauseGameController.remove();
  }

  update(dt) {
    this.world.update(dt);

    if (this.world.pixieHasCrashed) {
      if (this.numberOfLives > 1) {
        this.world.numberOfTeddyBears = this.numberOfTeddyBears;
        this.world.resetScene();
        this.world.resetEmitter();
        this.world.decreaseNumberOfLives();
        this.world.pixie.visible = true;
        this.world.pixieHasCrashed = false;
        this.world.pixieIsExploding = false;
        this.stateStack.push(new HintState(this.stage, this.stateStack, this, `Level ${this.currentLevel+1}`));
        this.numberOfLives--;
      } else {
        this.gameOver(false);
      }
    }

    if (this.world.pixieHasReachedEnd) {
      this.currentLevel++;
      this.world.level++;
      this.sounds.tada.play();

      if (this.currentLevel <= NUMBER_OF_LEVELS) {
        this.world.resetScene();
        this.numberOfTeddyBears = this.world.numberOfTeddyBears;
        this.world.pixieHasReachedEnd = false;
        this.stateStack.push(new HintState(this.stage, this.stateStack, this, `Level ${this.currentLevel+1}`));
      } else {
        this.gameOver(true);
      }
    }

    return false;
  }

  gameOver(sucess) {
    this.pauseGameController.remove();
    this.popFromStack();
    this.stateStack.push(new GameOverState(this.stage, this.stateStack, this.textures, this.sounds, sucess));
  }
}
