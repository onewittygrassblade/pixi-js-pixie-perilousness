import Pixie from './Pixie.js';
import randomInt from './helpers/randomInt.js';
import keyController from './keyController.js';
import contain from './helpers/contain.js';
import hitTestRectangle from './helpers/hitTestRectangle.js';
import wait from './helpers/wait.js';

import { loader, resources, Container, Sprite, TilingSprite, Text } from './const/aliases.js';

import { gravity, wingPower, numberOfPillars } from './const/gameConstants.js';

export default class World {
  constructor(renderer) {
    this.renderer = renderer;
    this.stage = new Container();

    this.state = this.menu.bind(this);

    loader.add('images/pixie-perilousness.json').load(this.setup.bind(this));
  }

  setup() {
    this.id = resources['images/pixie-perilousness.json'].textures;

    this.buildScene();

    this.createMenuText();

    this.initializeKeys();
  }

  createMenuText() {
    this.menuText = new Text(
      'Hit Enter\nto start',
      {
        fontSize: 60,
        fill : 0xe6007e,
        align : 'center'
      }
    );
    this.menuText.x = this.renderer.width / 2 - this.menuText.width / 2;
    this.menuText.y = this.renderer.height / 2 - this.menuText.height / 2;
    this.stage.addChild(this.menuText);
  }

  buildScene() {
    this.sky = new TilingSprite(this.id["clouds.png"], this.renderer.view.width, this.renderer.view.height);
    this.stage.addChild(this.sky);

    // Create a container for the blocks and finish
    this.blocks = new Container();
    this.stage.addChild(this.blocks);

    this.createBlocks();
    this.createFinish();

    this.createPixie();
  }

  createBlocks() {
    let pillarHeight = 8;
    let gapSize = 4;
    let gapReductionFrequency = 5;

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
          let block = new Sprite(this.id["greenBlock.png"]);
          this.blocks.addChild(block);
          block.x = (i * 384) + 512;
          block.y = j * 64;
        }
      }
    }
  }

  createFinish() {
    this.finish = new Sprite(this.id["finish.png"]);
    this.blocks.addChild(this.finish);
    this.finish.x = ((numberOfPillars - 1) * 384) + 896;
    this.finish.y = 192;
  }

  createPixie() {
    let pixieFrames = [this.id["0.png"], this.id["1.png"], this.id["2.png"]];
    this.pixie = new Pixie(pixieFrames);
    this.stage.addChild(this.pixie);
  }

  initializeKeys() {
    let spacePressCallback = () => {
      this.pixie.vy += wingPower;
      if (this.pixie.vy < wingPower) {
        this.pixie.vy = wingPower;
      }
      this.pixie.play();
    };
    let spaceReleaseCallback = () => {
      this.pixie.stop();
    };

    let enterPressCallback = undefined;

    let enterReleaseCallback = () => {
      this.menuText.visible = false;
      this.state = this.play.bind(this);
    }

    let spaceController = new keyController(32, spacePressCallback, spaceReleaseCallback);
    let enterController = new keyController(13, enterPressCallback, enterReleaseCallback);
  }

  draw() {
    this.renderer.render(this.stage);
  }

  menu() {

  }

  play() {
    // Scroll sky background
    this.sky.tilePosition.x -= 1;

    // Move blocks and finish at a rate of 120 pixels per second
    if (this.finish.getGlobalPosition().x > 256) {
      this.blocks.x -= 2;
    }

    this.pixie.vy += gravity;
    this.pixie.y += this.pixie.vy;

    // Keep pixie within canvas
    let pixieVsStage = contain(
      this.pixie,
      {
        x: 0,
        y: 0,
        width: this.renderer.view.width,
        height: this.renderer.view.height
      }
    );

    if (pixieVsStage) {
      if (pixieVsStage.has("bottom") || pixieVsStage.has("top")) {
        this.pixie.vy = 0;
      }
    }

    // Check for collision between pixie and blocks
    let pixieVsBlock = this.blocks.children.some(block => {
      return hitTestRectangle(this.pixie, block, true);
    });

    if (pixieVsBlock) {
      this.pixie.visible = false;

      wait(1000).then(() => this.reset());
    }
  }

  reset() {
    this.pixie.visible = true;
    this.pixie.y = 256;
    this.blocks.x = 0;
    this.menuText.visible = true;
    this.state = this.menu.bind(this);
  }
}
