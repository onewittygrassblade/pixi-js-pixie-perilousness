import Pixi from 'pixi.js';
import scaleToWindow from './helpers/scaleToWindow.js';

//Create renderer by autodetecting whether to use WebGL or Canvas Drawing API to render graphics
// This creates a new canvas html tag
let renderer = PIXI.autoDetectRenderer(800, 400);

// scale canvas to window
//let scale = scaleToWindow(renderer.view);

// Add canvas to HTML
document.getElementById('root').appendChild(renderer.view);

// Create a (main/root) container object called the stage
let stage = new PIXI.Container();

// Load an image and call setup function after loading
PIXI.loader.add('images/cat.png').load(setup);

// This setup function will run when the image has loaded
function setup() {
  //Create a sprite from the texture
  let cat = new PIXI.Sprite(PIXI.loader.resources['images/cat.png'].texture);

  // Add sprite to the stage
  stage.addChild(cat);

  // Render the stage
renderer.render(stage);
}

