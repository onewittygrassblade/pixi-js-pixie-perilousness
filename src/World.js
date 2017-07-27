import Pixie from './Pixie.js';
import Emitter from './Emitter.js';
import KeyBinder from './KeyBinder.js';
import { randomInt } from './helpers/RandomNumbers.js';
import contain from './helpers/contain.js';
import hitTestRectangle from './helpers/hitTestRectangle.js';

import {  Container,
          Sprite,
          TilingSprite,
          Text,
          TextStyle } from './const/aliases.js';

import {  rendererWidth,
          rendererHeight,
          backgroundScrollingSpeed,
          foregroundScrollingSpeed,
          playerStartX,
          playerStartY,
          worldGravity,
          numberOfPillars,
          pillarHeight,
          maxGapSize,
          gapReductionFrequency } from './const/gameConstants.js';

export default class World {
  constructor(stage, textures) {
    this.stage = stage;
    this.textures = textures;

    this.gemsCollected = 0;

    this.hasAlivePlayer = true;
    this.pixieHasReachedEnd = false;
    this.gameOver = false;

    this.buildScene();

    this.addKeyControllers();
  }

  buildScene() {
    this.sky = new TilingSprite(this.textures['clouds.png'], rendererWidth, rendererHeight);
    this.stage.addChild(this.sky);

    this.createBlocks();
    this.createGems();
    this.createScoreDisplay();
    this.createFinish();
    this.createPixie();
  }

  createBlocks() {
    this.blocks = new Container();
    this.stage.addChild(this.blocks);

    let gapSize = maxGapSize;

    for (let i = 0; i < numberOfPillars; i++) {
      // Randomly select the starting vertical position for the gap
      let startGapNumber = randomInt(0, 8 - gapSize);

      // Periodically reduce gap size by 1
      if (i > 0 && i % gapReductionFrequency === 0) {
        gapSize--;
      }

      for (let j = 0; j < pillarHeight; j++) {
        // Create a block if it's not within the gap
        if (j < startGapNumber || j > startGapNumber + gapSize -1) {
          let block = new Sprite(this.textures['greenBlock.png']);
          this.blocks.addChild(block);
          block.x = (i * 384) + 512;
          block.y = j * 64;
        }
      }
    }
  }

  createGems() {
    this.gems = new Container();
    this.stage.addChild(this.gems);

    for (let i = 0; i < numberOfPillars; i++) {
      let gem = new Sprite(this.textures[`gem-${randomInt(1, 9)}.png`]);
      this.gems.addChild(gem);
      gem.x = (i * 384) + 736 - gem.width / 2;
      gem.y = randomInt(50, rendererHeight - 50);
    }
  }

  createScoreDisplay() {
    let textStyle = new TextStyle({
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0xe6007e,
      stroke: 0xf4d942,
      strokeThickness: 4
    });

    this.scoreDisplay = new Text('Gems: ' + this.gemsCollected, textStyle);

    this.scoreDisplay.x = 20;
    this.scoreDisplay.y = 20;

    this.stage.addChild(this.scoreDisplay);
  }

  createFinish() {
    this.finish = new Sprite(this.textures['finish.png']);
    this.stage.addChild(this.finish);
    this.finish.x = ((numberOfPillars - 1) * 384) + 896;
    this.finish.y = 192;
  }

  createPixie() {
    this.pixie = new Pixie(
      [this.textures['pixie-0.png'], this.textures['pixie-1.png'], this.textures['pixie-2.png']],
      playerStartX,
      playerStartY
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
      worldGravity,   // minGravity
      worldGravity,   // maxGravity
      0.00157,        // minRotationVelocity
      0.00628,        // maxRotationVelocity
      0.0001,         // minShrinkVelocity
      0.0005,          // maxShrinkVelocity
      500,            // minLifetime
      2000,           // maxLifetime
      2.4,            // minDirectionAngle
      3.6,            // maxDirectionAngle
      true,           // randomSpacing
      false,          // emitting
      10,             // emissionRate
      3               // numberOfParticlesPerEmit
    );

    this.stage.addChild(this.emitter.particleSystem.container);
    this.stage.addChild(this.pixie);
  }

  addKeyControllers() {
    let pixieFlapWings = () => {
      this.pixie.flapWings();
      this.emitter.emit();
    };
    let pixieStopFlapping = () => {
      this.pixie.stopFlapping();
      this.emitter.stop();
    };

    this.pixieController = new KeyBinder(32, pixieFlapWings, pixieStopFlapping);
  }

  removeKeyControllers() {
    this.pixieController.remove();
  }

  update(dt) {
    // Scroll sky background
    this.sky.tilePosition.x -= backgroundScrollingSpeed * dt;

    // Scroll scene
    if (this.finish.getGlobalPosition().x > 256) {
      this.blocks.x -= foregroundScrollingSpeed * dt;
      this.gems.x -= foregroundScrollingSpeed * dt;
      this.finish.x -= foregroundScrollingSpeed * dt;
    }

    // Update pixie's velocity and position
    this.pixie.updatePosition(dt);

    // Update emitter
    this.emitter.update(dt);

    // Keep pixie within canvas
    let pixieVsStage = contain(
      this.pixie,
      {
        x: 0,
        y: 0,
        width: rendererWidth,
        height: rendererHeight
      }
    );

    if (pixieVsStage) {
      if (pixieVsStage.has('bottom') || pixieVsStage.has('top')) {
        this.pixie.vy = 0;
      }
    }

    if (!this.gameOver) {
      this.checkCollisions();
    }
  }

  checkCollisions() {
    let pixieVsBlocks = this.blocks.children.some(block => {
      return hitTestRectangle(this.pixie, block, true);
    });

    let pixieVsFinish = hitTestRectangle(this.pixie, this.finish, true);

    for (let gem of this.gems.children) {
      if (hitTestRectangle(this.pixie, gem, true)) {
        this.gems.removeChild(gem);
        this.gemsCollected++;
        this.scoreDisplay.text = 'Gems: ' + this.gemsCollected;
      }
    }

    if (pixieVsBlocks) {
      this.stage.removeChild(this.pixie);

      this.emitter.stop();
      this.emitter.minInitialSpeed = 0.1;
      this.emitter.maxInitialSpeed = 0.3;
      this.emitter.minDirectionAngle = 0;
      this.emitter.maxDirectionAngle = 6.28;
      this.emitter.burst(40);

      setTimeout(() => {
        this.hasAlivePlayer = false;
      }, 1000);

      this.gameOver = true;
    }

    if (pixieVsFinish) {
      this.pixieHasReachedEnd = true;
    }
  }
}
