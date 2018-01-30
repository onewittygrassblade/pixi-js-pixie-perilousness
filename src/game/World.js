import { Container, Sprite, AnimatedSprite, BitmapText } from '../const/aliases.js';

import Sky from './Sky.js';
import Pixie from './Pixie.js';
import PointEmitter from '../particle/PointEmitter.js';
import Night from './Night.js';
import Light from './Light.js';
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
         PILLAR_SLIDING_SPEED,
         FINISH_X_OFFSET,
         FINISH_Y,
         INITIAL_NUMBER_OF_LIVES,
         MAX_NUMBER_OF_LIVES,
         GRAVITY } from '../const/worldData.js';

export default class World {
  constructor(gameContainer, textures, sounds, levelData) {
    this.container = gameContainer;
    this.textures = textures;
    this.sounds = sounds;

    this.pixieHasCrashed = false;
    this.pixieHasReachedEnd = false;
    this.numberOfLives = INITIAL_NUMBER_OF_LIVES;
    this.levelData = levelData;

    this.createSky();
    this.createForeground();
    this.createPixie();
    this.createNight();
    this.createLivesDisplay();
    this.createPickupActions();
  }

  createSky() {
    this.sky = new Sky(this.textures, RENDERER_WIDTH, RENDERER_HEIGHT);
    this.container.addChild(this.sky.container);
    if (this.levelData.winter) {
      this.sky.winterize();
    }
  }

  createForeground() {
    this.foreground = new Container();
    this.container.addChild(this.foreground);

    this.createPillars();
    this.createPickups();
    this.createFinish();
  }

  createPillars() {
    this.pillars = new Container();
    this.foreground.addChild(this.pillars);

    let gapSize = MAX_GAP_SIZE;

    for (let i = 0; i < NUM_PILLARS; i++) {
      let pillar = new Container();
      this.pillars.addChild(pillar);
      pillar.x = i * PILLAR_SPACING + PILLAR_START_X;
      pillar.gapSize = gapSize;

      // All pillars are made taller than the screen to allow sliding
      for (let j = 0; j < PILLAR_HEIGHT - gapSize; j++) {
        let upperBlock = new Sprite(this.textures['greenBlock.png']);
        upperBlock.y = j * BLOCK_HEIGHT;
        pillar.addChild(upperBlock);

        let lowerBlock = new Sprite(this.textures['greenBlock.png']);
        lowerBlock.y = (j + PILLAR_HEIGHT) * BLOCK_HEIGHT;
        pillar.addChild(lowerBlock);
      }

      if (i > 0 && i % GAP_REDUCTION_FREQUENCY === 0) {
        gapSize--;
      }
    }

    this.randomizePillarYPositions();
    this.randomizePillarYSpeed();
  }

  randomizePillarYPositions() {
    for (let pillar of this.pillars.children) {
      pillar.y = randomInt(0, PILLAR_HEIGHT - pillar.gapSize) * BLOCK_HEIGHT * -1;
    }
  }

  randomizePillarYSpeed() {
    for (let pillar of this.pillars.children) {
      pillar.vy = this.levelData.sliding ?
        PILLAR_SLIDING_SPEED * (Math.random() < 0.5 ? -1 : 1) :
        0;
    }
  }

  createPickups() {
    this.pickUps = new Container();
    this.foreground.addChild(this.pickUps);

    for (let i = 0; i < NUM_PILLARS; i++) {
      let pickUp = new Sprite(this.textures['gift.png']);
      pickUp.x = i * PILLAR_SPACING + PILLAR_START_X + BLOCK_WIDTH + (PILLAR_SPACING - BLOCK_WIDTH) / 2 - PICKUP_WIDTH / 2;
      this.pickUps.addChild(pickUp);
    }

    this.randomizePickUpYPositions();
  }

  randomizePickUpYPositions() {
    for (let pickUp of this.pickUps.children) {
      pickUp.y = randomInt(50, RENDERER_HEIGHT - 50);
    }
  }

  createFinish() {
    this.finish = new BitmapText('To next level!', {font: '96px pixie-font'});
    this.finish.x = NUM_PILLARS * PILLAR_SPACING + FINISH_X_OFFSET;
    this.finish.y = FINISH_Y;
    this.foreground.addChild(this.finish);
  }

  createPixie() {
    this.pixie = new Pixie(
      [this.textures['pixie-0.png'], this.textures['pixie-1.png'], this.textures['pixie-2.png']],
      PLAYER_START_X,
      PLAYER_START_Y,
      GRAVITY
    );

    this.pixieEmitter = new PointEmitter(
      [ this.textures["pink.png"], this.textures["yellow.png"], this.textures["green.png"], this.textures["violet.png"] ],
      18, 24,             // minSize, maxSize
      this.pixie,         // parent
      0, 16,              // offsetX, offsetY
      0, 0.1,             // minInitialSpeed, maxInitialSpeed
      0.0001, 0.0003,     // minGravity, maxGravity
      -0.00628, 0.00628,  // minRotationVelocity, maxRotationVelocity
      0.0001, 0.0005,     // minShrinkVelocity, maxShrinkVelocity
      500, 2000,          // minLifetime, maxLifetime
      3.5, 5.1,           // minDirectionAngle, maxDirectionAngle
      true,               // randomSpacing
      false,              // emitting
      10,                 // emissionRate
      3                   // numberOfParticlesPerEmit
    );

    this.container.addChild(this.pixieEmitter.particleSystem.container);
    this.container.addChild(this.pixie);
  }

  createNight() {
    this.night = new Night({ x: RENDERER_WIDTH, y: RENDERER_HEIGHT });
    this.container.addChild(this.night);
    this.light = new Light({ x: this.pixie.x, y: this.pixie.y }, { x: RENDERER_WIDTH, y: RENDERER_HEIGHT });
    this.night.mask = this.light.sprite;

    if (!this.levelData.night) {
      this.night.visible = false;
    }
  }

  createLivesDisplay() {
    this.livesContainer = new Container();
    this.container.addChild(this.livesContainer);

    for (let i = 0; i < this.numberOfLives; i++) {
      let life = new Sprite(this.textures['pixie-0.png']);
      life.x = i * (life.width + 10);
      this.livesContainer.addChild(life);
    }

    this.livesContainer.x = RENDERER_WIDTH - this.livesContainer.width;
  }

  resetScene() {
    this.pixieEmitter.particleSystem.clear();

    this.foreground.x = 0;
    this.resetPillars();
    this.resetPickups();

    this.resetPixie();
    this.pixie.vy = 0;
    this.pixie.y = PLAYER_START_Y;
    this.pixie.resetProperties();

    if (this.levelData.night) {
      this.night.visible = true;
      this.light.renderGradient({ x: this.pixie.x, y: this.pixie.y });
    } else {
      this.night.visible = false;
    }

    if (this.levelData.winter) {
      this.sky.winterize();
    } else {
      this.sky.summerize();
    }
  }

  resetPillars() {
    for (let pillar of this.pillars.children) {
      for (let block of pillar.children) {
        block.visible = true;
      }
    }
    this.randomizePillarYPositions();
    this.randomizePillarYSpeed();
  }

  resetPickups() {
    for (let pickUp of this.pickUps.children) {
      pickUp.visible = true;
    }
    this.randomizePickUpYPositions();
  }

  resetPixie() {
    this.pixie.gotoAndStop(0);
    this.pixie.ay = GRAVITY + this.pixie.addedWeight;
    this.pixieEmitter.stop();
  }

  resetAfterCrash() {
    this.resetScene();
    this.resetEmitter();
    this.pixie.visible = true;
    this.pixieHasCrashed = false;
  }

  resetEmitter() {
    this.pixieEmitter.minInitialSpeed = 0;
    this.pixieEmitter.maxInitialSpeed = 0.1;
    this.pixieEmitter.minDirectionAngle = 2.4;
    this.pixieEmitter.maxDirectionAngle = 3.6;
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
      this.pixie.ay = GRAVITY + this.pixie.addedWeight + this.pixie.wingPower;
      this.pixieEmitter.emit();
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

    if (this.levelData.sliding) {
      this.slidePillars(dt);
    }

    this.pixie.updateCurrent(dt);
    this.pixieEmitter.update(dt);
    if (this.levelData.night && this.pixie.visible) {
      this.light.renderGradient({ x: this.pixie.x, y: this.pixie.y });
    }

    this.containPixie();

    if (this.pixie.visible) {
      this.checkCollisions();
    }
  }

  scroll(dt) {
    this.sky.updateCurrent(BACKGROUND_SCROLL_SPEED, dt);

    if (this.finish.getGlobalPosition().x > 220) {
      this.foreground.x -= FOREGROUND_SCROLL_SPEED * dt;
    }
  }

  slidePillars(dt) {
    for (let pillar of this.pillars.children) {
      pillar.y += pillar.vy * dt;

      if (pillar.y > 0 || pillar.y < (PILLAR_HEIGHT - pillar.gapSize) * BLOCK_HEIGHT * -1) {
        pillar.vy *= -1;
      }
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

    pillars: for (let pillar of this.pillars.children) {
      blocks: for (let block of pillar.children) {
        if (block.visible && hitTestRectangle(this.pixie, block, true)) {
          if (this.pixie.invincible) {
            block.visible = false;
            this.sounds.bang.play();
          } else {
            pixieCrashed = true;
            break pillars;
          }
        }
      }
    }

    if (pixieCrashed) {
      this.pixieExplosion();
    }

    // pickUps
    for (let pickUp of this.pickUps.children) {
      if (pickUp.visible && hitTestRectangle(this.pixie, pickUp, true)) {
        pickUp.visible = false;

        if (this.pixie.effectTimer <= 0) {
          this.pickUpActions[randomInt(0, this.pickUpActions.length - 1)]();
        } else {
          this.uselessPickUp();
        }
      }
    }

    // finish
    if (hitTestRectangle(this.pixie, this.finish, true)) {
      this.resetPixie();
      this.pixieHasReachedEnd = true;
    }
  }

  pixieExplosion() {
    this.sounds.die.play();

    this.pixie.resetProperties();
    this.pixie.visible = false;

    this.emitterExplosion();

    setTimeout(() => {
      this.loseLife();
      this.pixieHasCrashed = true;
    }, 1000);
  }

  emitterExplosion() {
    this.pixieEmitter.stop();
    this.pixieEmitter.minInitialSpeed = 0.1;
    this.pixieEmitter.maxInitialSpeed = 0.3;
    this.pixieEmitter.minDirectionAngle = 0;
    this.pixieEmitter.maxDirectionAngle = 6.28;
    this.pixieEmitter.burst(50);
  }
}
