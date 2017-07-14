import Pixie from './Pixie.js';
import KeyBinder from './KeyBinder.js';
import randomInt from './helpers/randomInt.js';
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
    this.hasReachedEnd = false;

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
      let gem = new Sprite(this.textures[`gem-${randomInt(1, 9)}-small.png`]);
      this.gems.addChild(gem);
      gem.x = (i * 384) + 736 - gem.width / 2;
      gem.y = randomInt(50, rendererHeight - 50);
    }
  }

  createScoreDisplay() {
    let textStyle = {
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0xe6007e,
      stroke: 0xf4d942,
      strokeThickness: 4
    };

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
    let pixieFrames = [this.textures['0.png'], this.textures['1.png'], this.textures['2.png']];
    this.pixie = new Pixie(pixieFrames);
    this.stage.addChild(this.pixie);
  }

  addKeyControllers() {
    let pixieFlapWings = () => {
      this.pixie.flapWings();
      this.pixie.play();
    };
    let pixieStopFlapping = () => {
      this.pixie.stopFlapping();
      this.pixie.stop();
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

    this.pixie.vy += this.pixie.ay * dt;
    this.pixie.y += this.pixie.vy * dt;

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

    this.checkCollisions();
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
      while (this.stage.children[0]) {
        this.stage.removeChild(this.stage.children[0]);
      }

      this.hasAlivePlayer = false;
    }

    if (pixieVsFinish) {
      while (this.stage.children[0]) {
        this.stage.removeChild(this.stage.children[0]);
      }

      this.hasReachedEnd = true;
    }
  }
}
