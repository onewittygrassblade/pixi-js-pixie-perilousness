import { Container, Sprite, BitmapText } from '../const/aliases';

import Sky from './Sky';
import Pillars from './Pillars';
import PickUps from './PickUps';
import Pixie from './Pixie';
import PointEmitter from '../particle/PointEmitter';
import Night from './Night';
import IceShardsManager from './IceShardsManager';
import { randomInt } from '../helpers/RandomNumbers';
import contain from '../helpers/contain';
import hitTestRectangle from '../helpers/hitTestRectangle';
import TimeManager from '../helpers/TimeManager';

import { RENDERER_WIDTH, RENDERER_HEIGHT, FONTS } from '../const/app';

import {
  BACKGROUND_SCROLL_SPEED,
  FOREGROUND_SCROLL_SPEED,
  PLAYER_START_X,
  PLAYER_START_Y,
  PILLAR_START_X,
  FINISH_X,
  FINISH_Y,
  INITIAL_NUMBER_OF_LIVES,
  MAX_NUMBER_OF_LIVES,
  ICE_SHARD_FREQUENCY,
} from '../const/world';

export default class World {
  constructor(gameContainer, textures, sounds, levelData) {
    this.container = gameContainer;
    this.textures = textures;
    this.sounds = sounds;
    this.levelData = levelData;

    this.pixieHasCrashed = false;
    this.hasAlivePlayer = true;
    this.playerHasReachedEnd = false;
    this.numberOfLives = INITIAL_NUMBER_OF_LIVES;
    this.timeManager = new TimeManager();
    this.numberOfStars = 0;
    this.numberOfStarsForLevel = 0;

    this.layers = {
      background: null,
      foreground: new Container(),
      player: new Container(),
      weatherEffect: new Container(),
      infoDisplay: new Container(),
    };

    this.iceShardsManager = new IceShardsManager(
      this.layers.weatherEffect,
      [this.textures['ice-shard.png']],
      ICE_SHARD_FREQUENCY
    );

    this.createSky();
    this.createForeground();
    this.createPixie();
    this.createNight();
    this.createInfoDisplay();
    this.createPickUpActions();

    Object.keys(this.layers).forEach((layerName) => {
      this.container.addChild(this.layers[layerName]);
    });
  }

  // Create methods

  createSky() {
    this.sky = new Sky(this.textures, RENDERER_WIDTH, RENDERER_HEIGHT);
    this.layers.background = this.sky.container;
    if (this.levelData.winter) {
      this.sky.winterize();
    }
  }

  createForeground() {
    this.createPillars(this.textures['greenBlock.png']);
    this.createPickUps(this.textures['gift.png']);
    this.createFinish();
  }

  createPillars(texture) {
    this.pillars = new Pillars(texture);
    this.pillars.x = PILLAR_START_X;
    this.layers.foreground.addChild(this.pillars);
    this.pillars.randomizeYPositions();
    this.pillars.randomizeYSpeeds();
  }

  createPickUps(texture) {
    this.pickUps = new PickUps(texture);
    this.pickUps.x = PILLAR_START_X;
    this.layers.foreground.addChild(this.pickUps);
    this.pickUps.randomizeYPositions();
  }

  createFinish() {
    this.finish = new BitmapText('To next level!', { font: FONTS.xlarge });
    this.finish.x = FINISH_X;
    this.finish.y = FINISH_Y;
    this.layers.foreground.addChild(this.finish);
  }

  createPixie() {
    this.pixie = new Pixie(
      [this.textures['pixie-0.png'], this.textures['pixie-1.png'], this.textures['pixie-2.png']],
      PLAYER_START_X,
      PLAYER_START_Y,
      this.textures['weight.png'],
      this.textures['balloon.png'],
      this.textures['star.png'],
    );

    /* eslint-disable no-multi-spaces */
    this.pixieEmitter = new PointEmitter(
      [this.textures['pink.png'], this.textures['yellow.png'], this.textures['green.png'], this.textures['violet.png']],
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
      3,                  // numberOfParticlesPerEmit
    );
    /* eslint-enable no-multi-spaces */

    this.layers.player.addChild(this.pixieEmitter.particleSystem.container);
    this.layers.player.addChild(this.pixie.weight);
    this.layers.player.addChild(this.pixie.balloon);
    this.layers.player.addChild(this.pixie.star);
    this.layers.player.addChild(this.pixie);
  }

  createNight() {
    this.night = new Night(RENDERER_WIDTH, RENDERER_HEIGHT, this.pixie.x, this.pixie.y);
    this.layers.weatherEffect.addChild(this.night);

    if (!this.levelData.night) {
      this.night.visible = false;
    }
  }

  createInfoDisplay() {
    this.livesContainer = new Container();
    this.layers.infoDisplay.addChild(this.livesContainer);

    for (let i = 0; i < this.numberOfLives; i++) {
      const life = new Sprite(this.textures['pixie-0.png']);
      life.x = i * (life.width + 10);
      this.livesContainer.addChild(life);
    }

    this.livesContainer.x = RENDERER_WIDTH - this.livesContainer.width;

    const starsContainer = new Container();
    this.layers.infoDisplay.addChild(starsContainer);

    const star = new Sprite(this.textures['star.png']);
    star.width = 33;
    star.height = 32;
    starsContainer.addChild(star);
    this.numberOfStarsText = new BitmapText(this.numberOfStars.toString(), { font: FONTS.xsmall });
    this.numberOfStarsText.x = 46;
    this.numberOfStarsText.y = 6;
    starsContainer.addChild(this.numberOfStarsText);

    starsContainer.x = 822;
    starsContainer.y = 40;
  }

  // Reset methods

  resetAfterCrash() {
    this.resetWorld();
    this.pixie.visible = true;
    this.pixieHasCrashed = false;
    this.hasAlivePlayer = true;
  }

  resetForNextLevel() {
    this.resetWorld();
    this.playerHasReachedEnd = false;
  }

  resetWorld() {
    this.resetPixie();
    this.resetScene();
    this.resetEmitter();
    this.resetPickUpActions();
    this.timeManager.clear();
  }

  resetPixie() {
    this.pixie.stopFlapping();
    this.pixie.vy = 0;
    this.pixie.y = PLAYER_START_Y;
    this.pixie.resetProperties();
  }

  resetScene() {
    this.layers.foreground.x = 0;
    this.pillars.reset();
    this.pickUps.reset();
    this.numberOfStarsText.text = this.numberOfStars.toString();

    if (this.levelData.night) {
      this.night.visible = true;
      this.night.renderGradient(this.pixie.x, this.pixie.y);
    } else {
      this.night.visible = false;
    }

    this.iceShardsManager.reset();

    if (this.levelData.winter) {
      this.sky.winterize();
    } else {
      this.sky.summerize();
    }
  }

  resetEmitter() {
    this.pixieEmitter.stop();
    this.pixieEmitter.particleSystem.clear();
    this.pixieEmitter.minInitialSpeed = 0;
    this.pixieEmitter.maxInitialSpeed = 0.1;
    this.pixieEmitter.minDirectionAngle = 2.4;
    this.pixieEmitter.maxDirectionAngle = 3.6;
  }

  // Pick up actions

  createPickUpActions() {
    const pickUpActions = [
      {
        action: this.gainLife.bind(this),
        weight: 1,
      },
      {
        action: this.gainInvincibility.bind(this),
        weight: 1,
      },
      {
        action: this.gainWeight.bind(this),
        weight: 1,
      },
      {
        action: this.gainBalloon.bind(this),
        weight: 1,
      },
      {
        action: this.gainStar.bind(this),
        weight: 8,
      },
    ];

    this.pickUpActions = [];

    for (let i = 0; i < pickUpActions.length; i++) {
      for (let j = 0; j < pickUpActions[i].weight; j++) {
        this.pickUpActions.push(pickUpActions[i].action);
      }
    }
  }

  resetPickUpActions() {
    this.pickUpActions[1] = this.gainInvincibility.bind(this);
    this.pickUpActions[2] = this.gainWeight.bind(this);
    this.pickUpActions[3] = this.gainBalloon.bind(this);
  }

  gainLife() {
    const life = new Sprite(this.textures['pixie-0.png']);
    life.x = this.numberOfLives * (life.width + 10);
    this.livesContainer.addChild(life);
    this.livesContainer.x = RENDERER_WIDTH - this.livesContainer.width;

    this.numberOfLives += 1;

    this.sounds.powerup.play();

    if (this.numberOfLives === MAX_NUMBER_OF_LIVES) {
      this.pickUpActions[0] = this.gainStar.bind(this);
    }
  }

  loseLife() {
    this.livesContainer.removeChildAt(this.livesContainer.children.length - 1);
    this.livesContainer.x = RENDERER_WIDTH - this.livesContainer.width;

    this.numberOfLives -= 1;

    this.pickUpActions[0] = this.gainLife.bind(this);
  }

  hasLives() {
    return this.numberOfLives > 0;
  }

  gainInvincibility() {
    this.pixie.gainInvincibility();
    this.pickUpActions[1] = this.gainStar.bind(this);

    this.timeManager.setTimeout(() => {
      this.pixie.resetInvincibility();
      this.pickUpActions[1] = this.gainInvincibility.bind(this);
    }, 8000);
  }

  gainWeight() {
    this.pixie.gainWeight();
    this.sounds.metal.play();

    this.pickUpActions[2] = this.gainStar.bind(this);
    this.pickUpActions[3] = this.gainStar.bind(this);

    this.timeManager.setTimeout(() => {
      this.pixie.resetWeight();
      this.pickUpActions[2] = this.gainWeight.bind(this);
      this.pickUpActions[3] = this.gainBalloon.bind(this);
    }, 8000);
  }

  gainBalloon() {
    this.pixie.gainBalloon();
    this.sounds.whoosh.play();

    this.pickUpActions[2] = this.gainStar.bind(this);
    this.pickUpActions[3] = this.gainStar.bind(this);

    this.timeManager.setTimeout(() => {
      this.pixie.resetBalloon();
      this.pickUpActions[2] = this.gainWeight.bind(this);
      this.pickUpActions[3] = this.gainBalloon.bind(this);
    }, 8000);
  }

  gainStar() {
    this.pixie.showStar();
    this.sounds.pickup.play();

    this.numberOfStarsForLevel += 1;
    this.numberOfStarsText.text = (this.numberOfStars + this.numberOfStarsForLevel).toString();
  }

  handleEvent(e) {
    if (!this.pixieHasCrashed && e.keyCode === 32) {
      switch (e.type) {
        case 'keydown':
          this.pixie.flapWings();
          this.pixieEmitter.emit();
          break;
        case 'keyup':
          this.pixie.stopFlapping();
          this.pixieEmitter.stop();
          break;
        default:
      }
    }
  }

  // Update methods

  update(dt) {
    this.scroll(dt);

    if (this.levelData.sliding) {
      this.pillars.slide(dt);
    }

    if (this.levelData.winter) {
      this.iceShardsManager.update(dt);
    }

    this.pixie.updateCurrent(dt);
    this.pixieEmitter.update(dt);
    this.timeManager.update(dt);
    if (this.levelData.night && this.pixie.visible) {
      this.night.renderGradient(this.pixie.x, this.pixie.y);
    }

    this.containPixie();

    if (this.pixie.visible) {
      this.checkCollisions();
    }
  }

  scroll(dt) {
    this.sky.updateCurrent(BACKGROUND_SCROLL_SPEED, dt);

    if (this.finish.getGlobalPosition().x > 220) {
      this.layers.foreground.x -= FOREGROUND_SCROLL_SPEED * dt;
    }
  }

  containPixie() {
    const pixieVsCanvas = contain(
      this.pixie,
      {
        x: 0,
        y: 0,
        width: RENDERER_WIDTH,
        height: RENDERER_HEIGHT,
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
    /* eslint-disable arrow-body-style */
    const hitBlock = this.pillars.getAllBlocks().find((block) => {
      return block.visible && hitTestRectangle(this.pixie, block, true);
    });

    if (hitBlock) {
      if (this.pixie.invincible) {
        hitBlock.visible = false;
        this.sounds.bang.play();
      } else {
        this.pixieHasCrashed = true;
      }
    }

    // ice shards
    const hitShard = this.iceShardsManager.iceShards.find((iceShard) => {
      return iceShard.visible && hitTestRectangle(this.pixie, iceShard, true);
    });

    if (hitShard) {
      if (this.pixie.invincible) {
        hitShard.visible = false;
      } else {
        this.pixieHasCrashed = true;
      }
    }
    /* eslint-enable arrow-body-style */

    if (this.pixieHasCrashed) {
      this.pixieExplosion();
      this.numberOfStarsForLevel = 0;
    }

    // pickUps
    this.pickUps.children.forEach((pickUp) => {
      if (pickUp.visible && hitTestRectangle(this.pixie, pickUp, true)) {
        pickUp.visible = false;
        this.pickUpActions[randomInt(0, 11)]();
      }
    });

    // finish
    if (hitTestRectangle(this.pixie, this.finish, true)) {
      this.resetPixie();
      this.playerHasReachedEnd = true;
      this.numberOfStars += this.numberOfStarsForLevel;
      this.numberOfStarsForLevel = 0;
    }
  }

  pixieExplosion() {
    this.sounds.die.play();

    this.pixie.resetProperties();
    this.pixie.visible = false;

    this.emitterExplosion();

    this.timeManager.setTimeout(() => {
      this.loseLife();
      this.hasAlivePlayer = false;
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

  setFinishTextForFinalLevel() {
    this.finish.text = 'To home!';
  }
}
