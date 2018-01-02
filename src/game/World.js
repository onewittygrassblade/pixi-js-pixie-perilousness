import { Container, Sprite, AnimatedSprite, BitmapText } from '../const/aliases.js';

import Pixie from './Pixie.js';
import PixieEmitter from './PixieEmitter.js';
import KeyBinder from '../helpers/KeyBinder.js';
import { randomInt } from '../helpers/RandomNumbers.js';
import contain from '../helpers/contain.js';
import hitTestRectangle from '../helpers/hitTestRectangle.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

import { BACKGROUND_SCROLL_SPEED,
         FOREGROUND_SCROLL_SPEED,
         PLAYER_START_X,
         PLAYER_START_Y,
         BLOCK_WIDTH,
         BLOCK_HEIGHT,
         PICKUP_WIDTH,
         PILLAR_START_X,
         PILLAR_SPACING,
         NUM_PILLARS,
         PILLAR_HEIGHT,
         MAX_GAP_SIZE,
         GAP_REDUCTION_FREQUENCY,
         TUNNEL_LENGTH,
         FINISH_X_OFFSET,
         FINISH_Y,
         INITIAL_NUMBER_OF_LIVES,
         MAX_NUMBER_OF_LIVES,
         WORLD_GRAVITY } from '../const/worldData.js';

export default class World {
  constructor(stage, gameContainer, textures, sounds, levelData) {
    this.container = gameContainer;
    this.textures = textures;
    this.sounds = sounds;

    this.pixieIsExploding = false;
    this.pixieHasCrashed = false;
    this.pixieHasReachedEnd = false;
    this.numberOfLives = INITIAL_NUMBER_OF_LIVES;
    this.levelData = levelData;

    this.sky = stage.getChildAt(0);

    this.blocks = new Container();
    this.container.addChild(this.blocks);

    this.pickUps = new Container();
    this.container.addChild(this.pickUps);

    this.buildScene();

    this.createPickupActions();
  }

  buildScene() {
    const positions = this.computePositions();
    this.createBlocks(positions.blocks);
    this.createPickups(positions.pickUps);
    this.createFinish();
    this.createPixie();
    this.createLivesDisplay();
  }

  computePositions() {
    let blockPositions = [];
    let pickUpPositions = [];

    let gapSize = MAX_GAP_SIZE;

    for (let i = 0; i < NUM_PILLARS; i++) {
      // Randomly select the starting vertical position for the gap
      let startGapNumber = randomInt(0, PILLAR_HEIGHT - gapSize);

      // Periodically reduce gap size by 1
      if (i > 0 && i % GAP_REDUCTION_FREQUENCY === 0) {
        gapSize--;
      }

      for (let j = 0; j < PILLAR_HEIGHT; j++) {
        // Create a block if it's not within the gap
        if (j < startGapNumber || j > startGapNumber + gapSize - 1) {
          blockPositions.push({
            x: this.levelData.tunnels ?
              i * (PILLAR_SPACING + TUNNEL_LENGTH * BLOCK_WIDTH) + PILLAR_START_X :
              i * PILLAR_SPACING + PILLAR_START_X,
            y: j * BLOCK_HEIGHT
          });
        }

        if (this.levelData.tunnels && (j === startGapNumber - 1 || j === startGapNumber + gapSize)) {
          for (let k = 1; k <= TUNNEL_LENGTH; k++) {
            blockPositions.push({
              x: i * (PILLAR_SPACING + TUNNEL_LENGTH * BLOCK_WIDTH) + k * BLOCK_WIDTH + PILLAR_START_X,
              y: j * BLOCK_HEIGHT
            });
          }
        }
      }

      pickUpPositions.push({
        x: this.levelData.tunnels ?
          i * (PILLAR_SPACING + TUNNEL_LENGTH * BLOCK_WIDTH) + PILLAR_START_X + (TUNNEL_LENGTH / 2 + 1) * BLOCK_WIDTH - PICKUP_WIDTH / 2 :
          i * PILLAR_SPACING + PILLAR_START_X + BLOCK_WIDTH + (PILLAR_SPACING - BLOCK_WIDTH) / 2 - PICKUP_WIDTH / 2,
        y: this.levelData.tunnels ?
          randomInt(startGapNumber * BLOCK_HEIGHT + 50, (startGapNumber + gapSize) * BLOCK_HEIGHT - 50) :
          randomInt(50, RENDERER_HEIGHT - 50)
      });
    }

    return { blocks: blockPositions, pickUps: pickUpPositions };
  }

  createBlocks(positions) {
    for (let pos of positions) {
      let block = new Sprite(this.textures['greenBlock.png']);
      block.x = pos.x;
      block.y = pos.y;
      this.blocks.addChild(block);
    }
  }

  createPickups(positions) {
    for (let pos of positions) {
      let pickUp = new Sprite(this.textures['gift.png']);
      pickUp.x = pos.x;
      pickUp.y = pos.y;
      this.pickUps.addChild(pickUp);
    }
  }

  createFinish() {
    this.finish = new BitmapText('To next level!', {font: '96px pixie-font'});
    this.finish.x = NUM_PILLARS * PILLAR_SPACING + FINISH_X_OFFSET;
    this.finish.y = FINISH_Y;
    this.container.addChild(this.finish);
  }

  createPixie() {
    this.pixie = new Pixie(
      [this.textures['pixie-0.png'], this.textures['pixie-1.png'], this.textures['pixie-2.png']],
      PLAYER_START_X,
      PLAYER_START_Y,
      WORLD_GRAVITY
    );

    this.emitter = new PixieEmitter(
      this.pixie,
      [this.textures["pink.png"], this.textures["yellow.png"], this.textures["green.png"], this.textures["violet.png"]]
    );

    this.container.addChild(this.emitter.particleSystem.container);
    this.container.addChild(this.pixie);
  }

  createLivesDisplay() {
    this.livesContainer = new Container();

    for (let i = 0; i < this.numberOfLives; i++) {
      let life = new Sprite(this.textures['pixie-0.png']);
      life.x = i * (life.width + 10);
      this.livesContainer.addChild(life);
    }

    this.livesContainer.x = RENDERER_WIDTH - this.livesContainer.width;
    this.container.addChild(this.livesContainer);
  }

  resetScene() {
    this.emitter.particleSystem.clear();

    const positions = this.computePositions();

    this.blocks.x = 0;
    this.blocks.removeChildren();
    this.createBlocks(positions.blocks);

    this.pickUps.removeChildren();
    this.pickUps.x = 0;
    this.createPickups(positions.pickUps);

    this.finish.x = this.levelData.tunnels ?
      NUM_PILLARS * (PILLAR_SPACING + TUNNEL_LENGTH * BLOCK_WIDTH) + FINISH_X_OFFSET :
      NUM_PILLARS * PILLAR_SPACING + FINISH_X_OFFSET;

    this.resetPixie();
    this.pixie.vy = 0;
    this.pixie.y = PLAYER_START_Y;
    this.pixie.resetProperties();
  }

  resetPixie() {
    this.pixie.gotoAndStop(0);
    this.pixie.ay = WORLD_GRAVITY + this.pixie.addedGravity;
    this.emitter.stop();
  }

  resetAfterCrash() {
    this.resetScene();
    this.resetEmitter();
    this.pixie.visible = true;
    this.pixieHasCrashed = false;
    this.pixieIsExploding = false;
  }

  resetEmitter() {
    this.emitter.minInitialSpeed = 0;
    this.emitter.maxInitialSpeed = 0.1;
    this.emitter.minDirectionAngle = 2.4;
    this.emitter.maxDirectionAngle = 3.6;
  }

  explosion() {
    this.emitter.stop();
    this.emitter.minInitialSpeed = 0.1;
    this.emitter.maxInitialSpeed = 0.3;
    this.emitter.minDirectionAngle = 0;
    this.emitter.maxDirectionAngle = 6.28;
    this.emitter.burst(40);
  }

  resetForNextLevel() {
    this.resetScene();
    this.pixieHasReachedEnd = false;
  }

  setFinishTextForFinalLevel() {
    this.finish.text = 'To home!';
  }

  addEventListeners() {
    let pixieFlapWings = () => {
      this.pixie.play();
      this.pixie.ay = WORLD_GRAVITY + this.pixie.addedGravity + this.pixie.wingPower;
      this.emitter.emit();
    };
    let pixieStopFlapping = () => {
      this.resetPixie();
    };

    this.pixieController = new KeyBinder(32, pixieFlapWings, pixieStopFlapping);
    this.pixieController.addEventListeners();
  }

  removeEventListeners() {
    this.pixieController.removeEventListeners();
  }

  createPickupActions() {
    let pickUpActions = [
      this.gainExtraLife.bind(this),
      this.pixie.gainInvincibility.bind(this.pixie),
      this.pixie.gainWeight.bind(this.pixie, new Sprite(this.textures['weight.png']), this.sounds.metal),
      this.pixie.gainBalloon.bind(this.pixie, new Sprite(this.textures['balloon.png']), this.sounds.whoosh),
      this.uselessPickUp.bind(this)
    ];

    let weights = [1, 1, 1, 1, 8];

    this.pickUpActions = [];

    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights[i]; j++) {
        this.pickUpActions.push(pickUpActions[i]);
      }
    }
  }

  gainExtraLife() {
    if (this.numberOfLives < MAX_NUMBER_OF_LIVES) {
      let life = new Sprite(this.textures['pixie-0.png']);
      life.x = this.numberOfLives * (life.width + 10);
      this.livesContainer.addChild(life);
      this.livesContainer.x = RENDERER_WIDTH - this.livesContainer.width;

      this.numberOfLives++;

      this.sounds.powerup.play();
    }
  }

  uselessPickUp() {
    this.sounds.powerup.play();
  }

  loseLife() {
    this.numberOfLives--;
    this.livesContainer.removeChildAt(this.livesContainer.children.length - 1);
    this.livesContainer.x = RENDERER_WIDTH - this.livesContainer.width;
  }

  hasLives() {
    return this.numberOfLives > 0;
  }

  update(dt) {
    this.scroll(dt);

    this.pixie.updateCurrent(dt);
    this.emitter.update(dt);

    this.containPixie();

    if (!this.pixieIsExploding) {
      this.checkCollisions();
    }
  }

  scroll(dt) {
    this.sky.tilePosition.x -= BACKGROUND_SCROLL_SPEED * dt;

    if (this.finish.getGlobalPosition().x > 220) {
      this.blocks.x -= FOREGROUND_SCROLL_SPEED * dt;
      this.pickUps.x -= FOREGROUND_SCROLL_SPEED * dt;
      this.finish.x -= FOREGROUND_SCROLL_SPEED * dt;
    }
  }

  containPixie() {
    const pixieVsCanvas = contain(
      this.pixie,
      {
        x: 0,
        y: 0,
        width: RENDERER_WIDTH,
        height: RENDERER_HEIGHT
      }
    );

    if (pixieVsCanvas) {
      if (pixieVsCanvas.has('bottom') || pixieVsCanvas.has('top')) {
        this.pixie.vy = 0;
      }
    }
  }

  checkCollisions() {
    // blocks
    let pixieCrashed = false;
    if (!this.pixie.invincible) {
      pixieCrashed = this.blocks.children.some(block => {
        return hitTestRectangle(this.pixie, block, true);
      });
    }
    else {
      for (let block of this.blocks.children) {
        if (hitTestRectangle(this.pixie, block, true)) {
          this.sounds.bang.play();
          this.blocks.removeChild(block);
        }
      }
    }

    if (pixieCrashed) {
      this.sounds.die.play();

      this.pixie.resetProperties();
      this.pixie.visible = false;

      this.explosion();

      setTimeout(() => {
        this.loseLife();
        this.pixieHasCrashed = true;
      }, 1000);

      this.pixieIsExploding = true;
    }

    // pickUps
    for (let pickUp of this.pickUps.children) {
      if (hitTestRectangle(this.pixie, pickUp, true)) {
        this.pickUps.removeChild(pickUp);
        this.pickUpActions[randomInt(0, this.pickUpActions.length - 1)]();
      }
    }

    // finish
    if (hitTestRectangle(this.pixie, this.finish, true)) {
      this.resetPixie();

      this.pixieHasReachedEnd = true;
    }
  }
}
