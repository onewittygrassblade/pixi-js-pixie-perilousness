import { Container, Sprite, AnimatedSprite, BitmapText } from '../const/aliases.js';

import Pixie from './Pixie.js';
import Emitter from '../particle/Emitter.js';
import KeyBinder from '../helpers/KeyBinder.js';
import { randomInt } from '../helpers/RandomNumbers.js';
import contain from '../helpers/contain.js';
import hitTestRectangle from '../helpers/hitTestRectangle.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

import { BACKGROUND_SCROLL_SPEED,
         FOREGROUND_SCROLL_SPEED,
         PLAYER_START_X,
         PLAYER_START_Y,
         NUM_PILLARS,
         PILLAR_HEIGHT,
         MAX_GAP_SIZE,
         GAP_REDUCTION_FREQUENCY,
         WORLD_GRAVITY } from '../const/worldData.js';

import { MAX_NUMBER_OF_LIVES } from '../const/gameData.js';

export default class World {
  constructor(stage, gameContainer, textures, sounds, gameState) {
    this.container = gameContainer;
    this.textures = textures;
    this.sounds = sounds;
    this.gameState = gameState;

    this.level = 0;
    this.pixieIsExploding = false;
    this.pixieHasCrashed = false;
    this.pixieHasReachedEnd = false;
    this.numberOfTeddyBears = this.gameState.numberOfTeddyBears;

    this.sky = stage.getChildAt(0);

    this.blocks = new Container();
    this.container.addChild(this.blocks);

    this.pickups = new Container();
    this.container.addChild(this.pickups);

    this.buildScene();

    this.addKeyControllers();

    this.createPickupActions();
  }

  buildScene() {
    this.createBlocks();
    this.createPickups();
    this.createInfoDisplay();
    this.createFinish();
    this.createPixie();
  }

  createBlocks() {
    let gapSize = MAX_GAP_SIZE;

    for (let i = 0; i < NUM_PILLARS; i++) {
      // Randomly select the starting vertical position for the gap
      let startGapNumber = randomInt(0, 8 - gapSize);

      // Periodically reduce gap size by 1
      if (i > 0 && i % GAP_REDUCTION_FREQUENCY === 0) {
        gapSize--;
      }

      for (let j = 0; j < PILLAR_HEIGHT; j++) {
        // Create a block if it's not within the gap
        if (j < startGapNumber || j > startGapNumber + gapSize -1) {
          let block = new Sprite(this.textures['greenBlock.png']);
          this.blocks.addChild(block);
          block.x = i * (384 + this.level * 64) + 512;
          block.y = j * 64;
        }

        if (j === startGapNumber - 1 || j === startGapNumber + gapSize) {
          for (let l = 1; l <= this.level; l++) {
            let block = new Sprite(this.textures['greenBlock.png']);
            this.blocks.addChild(block);
            block.x = i * (384 + this.level * 64) + l * 64 + 512;
            block.y = j * 64;
          }
        }
      }
    }
  }

  createPickups() {
    for (let i = 0; i < NUM_PILLARS; i++) {
      let pickup = new Sprite(this.textures['gift.png']);
      this.pickups.addChild(pickup);
      pickup.x = i * (384 + this.level * 64) + this.level * 64 + 720;
      pickup.y = randomInt(50, RENDERER_HEIGHT - 50);
    }
  }

  createInfoDisplay() {
    let infoContainer = new Container();
    infoContainer.x = 20;
    infoContainer.y = 20;
    this.container.addChild(infoContainer);

    this.livesContainer = new Container();
    infoContainer.addChild(this.livesContainer);
    for (let i = 0; i < this.gameState.numberOfLives; i++) {
      let life = new Sprite(this.textures['pixie-0.png']);
      life.x = i * (life.width + 10);
      this.livesContainer.addChild(life);
    }

    let teddybearContainer = new Container();
    teddybearContainer.y = 50;
    infoContainer.addChild(teddybearContainer);
    teddybearContainer.addChild(new Sprite(this.textures['teddybear.png']));
    this.numberOfTeddyBearsText = new BitmapText(this.numberOfTeddyBears.toString(), {font: '30px pixie-font'});
    this.numberOfTeddyBearsText.x = 40;
    this.numberOfTeddyBearsText.y = 4;
    teddybearContainer.addChild(this.numberOfTeddyBearsText);
  }

  createFinish() {
    this.finish = new BitmapText('Finish!', {font: '96px pixie-font'});

    this.finish.x = (NUM_PILLARS - 1) * 384 + 896;
    this.finish.y = 192;

    this.container.addChild(this.finish);
  }

  createPixie() {
    this.pixie = new Pixie(
      [this.textures['pixie-0.png'], this.textures['pixie-1.png'], this.textures['pixie-2.png']],
      PLAYER_START_X,
      PLAYER_START_Y,
      WORLD_GRAVITY
    );

    this.emitter = new Emitter(
      this.pixie,
      8,
      this.pixie.height / 2,
      [this.textures["pink.png"], this.textures["yellow.png"], this.textures["green.png"], this.textures["violet.png"]],
      18,             // minSize
      24,             // maxSize
      0,              // minInitialSpeed
      0.1,            // maxInitialSpeed
      0.0001,         // minGravity
      0.0003,         // maxGravity
      -0.00628,       // minRotationVelocity
      0.00628,        // maxRotationVelocity
      0.0001,         // minShrinkVelocity
      0.0005,         // maxShrinkVelocity
      500,            // minLifetime
      2000,           // maxLifetime
      2.4,            // minDirectionAngle
      3.6,            // maxDirectionAngle
      true,           // randomSpacing
      false,          // emitting
      10,             // emissionRate
      3               // numberOfParticlesPerEmit
    );

    this.container.addChild(this.emitter.particleSystem.container);
    this.container.addChild(this.pixie);
  }

  resetScene() {
    this.emitter.particleSystem.clear();

    this.blocks.x = 0;
    this.blocks.removeChildren();
    this.createBlocks();

    this.pickups.removeChildren();
    this.pickups.x = 0;
    this.createPickups();

    this.numberOfTeddyBearsText.text = this.numberOfTeddyBears.toString();

    this.finish.x = (NUM_PILLARS - 1) * (384 + this.level * 64) + 896;

    this.resetPixie();
    this.pixie.vy = 0;
    this.pixie.y = PLAYER_START_Y;
    this.pixie.addedGravity = 0;
    this.pixie.invincible = false;
    this.pixie.removeChildren();
  }

  resetEmitter() {
    this.emitter.minInitialSpeed = 0;
    this.emitter.maxInitialSpeed = 0.1;
    this.emitter.minDirectionAngle = 2.4;
    this.emitter.maxDirectionAngle = 3.6;
  }

  resetPixie() {
    this.pixie.gotoAndStop(0);
    this.pixie.ay = WORLD_GRAVITY + this.pixie.addedGravity;
    this.emitter.stop();
  }

  decreaseNumberOfLives() {
    this.livesContainer.removeChildAt(this.livesContainer.children.length - 1);
  }

  addKeyControllers() {
    let pixieFlapWings = () => {
      this.pixie.play();
      this.pixie.ay = WORLD_GRAVITY + this.pixie.addedGravity + this.pixie.wingPower;
      this.emitter.emit();
    };
    let pixieStopFlapping = () => {
      this.resetPixie();
    };

    this.pixieController = new KeyBinder(32, pixieFlapWings, pixieStopFlapping);
  }

  removeKeyControllers() {
    this.pixieController.remove();
  }

  createPickupActions() {
    let pickUpActions = [
      this.gainExtraLife.bind(this),
      this.pixie.gainInvincibility.bind(this.pixie),
      this.pixie.gainWeight.bind(this.pixie, new Sprite(this.textures['weight.png']), this.sounds.metal),
      this.pixie.gainBalloon.bind(this.pixie, new Sprite(this.textures['balloon.png']), this.sounds.whoosh),
      this.gainTeddyBear.bind(this)
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
    if (this.gameState.numberOfLives < MAX_NUMBER_OF_LIVES) {
      let life = new Sprite(this.textures['pixie-0.png']);
      life.x = this.gameState.numberOfLives * (life.width + 10);
      this.livesContainer.addChild(life);

      this.gameState.numberOfLives++;

      this.sounds.powerup.play();
    }
  }

  gainTeddyBear() {
    this.numberOfTeddyBears++;
    this.numberOfTeddyBearsText.text = this.numberOfTeddyBears.toString();
    this.sounds.pickup.play();
  }

  update(dt) {
    // Scroll sky background
    this.sky.tilePosition.x -= BACKGROUND_SCROLL_SPEED * dt;

    // Scroll scene
    if (this.finish.getGlobalPosition().x > 220) {
      this.blocks.x -= FOREGROUND_SCROLL_SPEED * dt;
      this.pickups.x -= FOREGROUND_SCROLL_SPEED * dt;
      this.finish.x -= FOREGROUND_SCROLL_SPEED * dt;
    }

    // Update pixie's velocity and position
    this.pixie.updateCurrent(dt);

    // Update emitter
    this.emitter.update(dt);

    // Keep pixie within canvas
    let pixieVsCanvas = contain(
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

    if (!this.pixieIsExploding) {
      this.checkCollisions();
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

      this.pixie.removeChildren();
      this.pixie.visible = false;
      this.pixie.addedGravity = 0;

      this.emitter.stop();
      this.emitter.minInitialSpeed = 0.1;
      this.emitter.maxInitialSpeed = 0.3;
      this.emitter.minDirectionAngle = 0;
      this.emitter.maxDirectionAngle = 6.28;
      this.emitter.burst(40);

      setTimeout(() => {
        this.pixieHasCrashed = true;
      }, 1000);

      this.pixieIsExploding = true;
    }

    // pickups
    for (let pickup of this.pickups.children) {
      if (hitTestRectangle(this.pixie, pickup, true)) {
        this.pickups.removeChild(pickup);

        if (this.pixie.effectTimer <= 0) {
          this.pickUpActions[randomInt(0, this.pickUpActions.length - 1)]();
        }
        else {
          this.gainTeddyBear();
        }
      }
    }

    // finish
    if (hitTestRectangle(this.pixie, this.finish, true)) {
      this.resetPixie();

      this.pixieHasReachedEnd = true;
    }
  }
}
