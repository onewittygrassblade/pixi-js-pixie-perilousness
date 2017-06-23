import Pixi from 'pixi.js';

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

function setup() {
  // Create alias pointing to the texture atlas's texture objects
  let id = resources['images/pixie-perilousness.json'].textures;

  // Create sky background using a TilingSprite
  let sky = new TilingSprite(id["clouds.png"], renderer.view.width, renderer.view.height);
  stage.addChild(sky);

  //Create the pixie sprite
  let pixie = new Sprite(id["0.png"]);
  stage.addChild(pixie);

  // Render the stage
renderer.render(stage);
}
