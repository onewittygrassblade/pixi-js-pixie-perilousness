import Pixi from 'pixi.js';
import randomInt from './helpers/randomInt.js';
import keyController from './keyController.js';
import contain from './helpers/contain.js';
import hitTestRectangle from './helpers/hitTestRectangle.js';
import wait from './helpers/wait.js';

// Aliases
const Container = PIXI.Container,
      autoDetectRenderer = PIXI.autoDetectRenderer,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      Sprite = PIXI.Sprite,
      TilingSprite = PIXI.extras.TilingSprite,
      AnimatedSprite = PIXI.extras.AnimatedSprite;

// Game constants
const rendererWidth = 910,
      rendererHeight = 512,
      playerStartX = 232,
      playerStartY = 256,
      gravity = 0.05,
      wingPower = -2.5,
      numberOfPillars = 15;

//Create renderer by autodetecting whether to use WebGL or Canvas Drawing API to render graphics
// This creates a new canvas html tag
let renderer = autoDetectRenderer(rendererWidth, rendererHeight);

// Add canvas to HTML
document.getElementById('root').appendChild(renderer.view);

// Create a main container object called the stage
let stage = new Container();

// Load the texture atlas and call setup function after loading
loader.add('images/pixie-perilousness.json').load(setup);

let menuText, id, sky, blocks, finish, pixie, state;

function setup() {
  buildScene();

  menuText = new PIXI.Text(
    'Hit Enter\nto start',
    {
      fontSize: 60,
      fill : 0xe6007e,
      align : 'center'
    }
  );
  menuText.x = rendererWidth / 2 - menuText.width / 2;
  menuText.y = rendererHeight / 2 - menuText.height / 2;
  stage.addChild(menuText);

  initializeKeys();

  state = menu;

  let pixieVsBlock = blocks.children.some(block => {
    return hitTestRectangle(pixie, block);
  });

  gameLoop();
}

function buildScene() {
  // Create alias pointing to the texture atlas's texture objects
  id = resources['images/pixie-perilousness.json'].textures;

  // Create sky background using a TilingSprite
  sky = new TilingSprite(id["clouds.png"], renderer.view.width, renderer.view.height);
  stage.addChild(sky);

  // Create a container for the blocks and finish line
  blocks = new Container();
  stage.addChild(blocks);

  createBlocks(id, blocks);
  createFinish(id, blocks);

  createPixie(id);
}

function createBlocks(id, blocks) {
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
        let block = new Sprite(id["greenBlock.png"]);
        blocks.addChild(block);
        block.x = (i * 384) + 512;
        block.y = j * 64;
      }
    }
  }
}

function createFinish(id, blocks) {
  finish = new Sprite(id["finish.png"]);
  blocks.addChild(finish);
  finish.x = ((numberOfPillars - 1) * 384) + 896;
  finish.y = 192;
}

function createPixie(id) {
  let pixieFrames = [id["0.png"], id["1.png"], id["2.png"]];
  pixie = new AnimatedSprite(pixieFrames);
  pixie.animationSpeed = 0.4;
  stage.addChild(pixie);

  pixie.x = playerStartX;
  pixie.y = playerStartY;

  pixie.vy = 0;
}

function initializeKeys() {
  let spacePressCallback = () => {
    pixie.vy += wingPower;
    if (pixie.vy < wingPower) {
      pixie.vy = wingPower;
    }
    pixie.play();
  };
  let spaceReleaseCallback = () => {
    pixie.stop();
  };

  let enterPressCallback = undefined;

  let enterReleaseCallback = () => {
    menuText.visible = false;
    state = play;
  }

  let spaceController = new keyController(32, spacePressCallback, spaceReleaseCallback);
  let enterController = new keyController(13, enterPressCallback, enterReleaseCallback);
}

function gameLoop() {
  // Loop this function 60 times per second
  requestAnimationFrame(gameLoop);

  state();

  // Render the stage
  renderer.render(stage);
}

function menu() {
}

function play() {
  // Scroll sky background at a rate of 60 pixels per second
  sky.tilePosition.x -= 1;

  // Move blocks and finish at a rate of 120 pixels per second
  if (finish.getGlobalPosition().x > 256) {
    blocks.x -= 2;
  }

  pixie.vy += gravity;
  pixie.y += pixie.vy;

  // Keep pixie within canvas
  let pixieVsStage = contain(
    pixie,
    {
      x: 0,
      y: 0,
      width: renderer.view.width,
      height: renderer.view.height
    }
  );

  if (pixieVsStage) {
    if (pixieVsStage.has("bottom") || pixieVsStage.has("top")) {
      pixie.vy = 0;
    }
  }

  // Check for collision between pixie and blocks
  let pixieVsBlock = blocks.children.some(block => {
    return hitTestRectangle(pixie, block, true);
  });

  if (pixieVsBlock) {
    pixie.visible = false;

    wait(1000).then(() => reset());
  }
}

function reset() {
  pixie.visible = true;
  pixie.y = 256;
  blocks.x = 0;
  menuText.visible = true;
  state = menu;
}
