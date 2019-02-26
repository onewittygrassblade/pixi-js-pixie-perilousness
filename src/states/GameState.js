import State from './State';
import World from '../game/World';

import LEVELS_DATA from '../const/levels';

export default class GameState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.context.gameStatus = 'running';
    this.world = new World(
      this.container,
      context.background,
      context.textures,
      context.sounds,
      LEVELS_DATA[0].world
    );
  }

  handleEvent(e) {
    super.handleEvent(e);
    this.world.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 27) {
      this.world.pixie.stopFlapping();
      this.world.pixieEmitter.stop();
      this.stateStack.pushState('PauseState');
    }

    return false;
  }

  update(dt) {
    this.world.update(dt);

    if (!this.world.hasAlivePlayer) {
      if (this.world.hasLives()) {
        this.world.resetAfterCrash();
        this.stateStack.pushState('HintState');
      } else {
        this.context.gameStatus = 'failure';
        this.gameOver();
      }
    }

    if (this.world.playerHasReachedEnd) {
      this.context.level += 1;
      this.context.sounds.tada.play();

      if (this.context.level < LEVELS_DATA.length) {
        this.world.levelData = LEVELS_DATA[this.context.level].world;
        this.world.resetForNextLevel();
        if (this.context.level === LEVELS_DATA.length - 1) {
          this.world.setFinishTextForFinalLevel();
        }
        this.context.musicPlayer.play(LEVELS_DATA[this.context.level].music);
        this.stateStack.pushState('HintState');
      } else {
        this.context.gameStatus = 'success';
        this.context.score = this.world.numberOfStars;
        this.gameOver();
      }
    }

    return false;
  }

  gameOver() {
    this.context.background.summerize();
    this.stateStack.popState();
    this.stateStack.pushState('GameOverState');
  }
}
