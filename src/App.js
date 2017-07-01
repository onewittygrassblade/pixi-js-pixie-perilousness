import World from './World.js'

import { autoDetectRenderer } from './const/aliases.js';

import { timePerFrame, rendererWidth, rendererHeight } from './const/gameConstants.js';

let lastFrameTimestamp = 0;
let timeSinceLastUpdate = 0;

export default class App {
  constructor() {
    //Create renderer by autodetecting whether to use WebGL or Canvas Drawing API to render graphics
    // This creates a new canvas html tag
    this.renderer = autoDetectRenderer(rendererWidth, rendererHeight);
    // Add canvas to HTML
    document.getElementById('root').appendChild(this.renderer.view);

    this.world = new World(this.renderer);
    // this.stateStack = new StateStack;
  }

  run() {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp) {
    timeSinceLastUpdate += timestamp - lastFrameTimestamp;
    lastFrameTimestamp = timestamp;

    while (timeSinceLastUpdate > timePerFrame) {
      timeSinceLastUpdate -= timePerFrame;
      this.world.state(timePerFrame);
    }

    this.world.draw();

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
