import Pixi from 'pixi.js';
import randomInt from './helpers/randomInt.js';

// Aliases
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TilingSprite = PIXI.extras.TilingSprite;

//Create renderer by autodetecting whether to use WebGL or Canvas Drawing API to render graphics
// This creates a new canvas html tag
let renderer = autoDetectRenderer(910, 512);

// Add canvas to HTML
document.getElementById('root').appendChild(renderer.view);

// Create a main container object called the stage
let stage = new Container();

// Load the texture atlas and call setup function after loading
loader.add('images/pixie-perilousness.json').load(setup);

let id;

function setup() {
  // Create alias pointing to the texture atlas's texture objects
  id = resources['images/pixie-perilousness.json'].textures;

  // Create sky background using a TilingSprite
  let sky = new TilingSprite(id["clouds.png"], renderer.view.width, renderer.view.height);
  stage.addChild(sky);

  //Create the pixie sprite
  let pixie = new Sprite(id["0.png"]);
  stage.addChild(pixie);

  buildBlocks(id);

  // Render the stage
  renderer.render(stage);
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
