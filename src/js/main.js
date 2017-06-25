import Pixi from 'pixi.js';
import randomInt from './helpers/randomInt.js';
import keyController from './keyController.js';
import contain from './helpers/contain.js';

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
      gravity = 0.03,
      wingPower = -0.5;

//Create renderer by autodetecting whether to use WebGL or Canvas Drawing API to render graphics
// This creates a new canvas html tag
let renderer = autoDetectRenderer(rendererWidth, rendererHeight);

// Add canvas to HTML
document.getElementById('root').appendChild(renderer.view);

// Create a main container object called the stage
let stage = new Container();

// Load the texture atlas and call setup function after loading
loader.add('images/pixie-perilousness.json').load(setup);

let id, sky, pixie, state;

function setup() {
  buildScene();

  initializeKeys();

  state = play;

  gameLoop();
}

function buildScene() {
  // Create alias pointing to the texture atlas's texture objects
  id = resources['images/pixie-perilousness.json'].textures;

  // Create sky background using a TilingSprite
  sky = new TilingSprite(id["clouds.png"], renderer.view.width, renderer.view.height);
  stage.addChild(sky);

  buildBlocks(id);

  createPixie(id);
}

function buildBlocks(id) {
  let blocks = new Container();
  stage.addChild(blocks);

  let numberOfPillars = 15;
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
    pixie.play();
  };
  let spaceReleaseCallback = () => {
    pixie.stop();
  };
  let space = new keyController(32, spacePressCallback, spaceReleaseCallback);
}

function gameLoop() {
  // Loop this function 60 times per second
  requestAnimationFrame(gameLoop);

  state();

  // Render the stage
  renderer.render(stage);
}

function play() {
  sky.tilePosition.x += 1;

  pixie.vy += gravity;
  pixie.y += pixie.vy;

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
}
