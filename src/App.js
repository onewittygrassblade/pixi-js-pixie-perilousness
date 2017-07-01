import World from './World.js'

import { autoDetectRenderer } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/gameConstants.js';

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
    requestAnimationFrame(this.run.bind(this));

    this.world.state();

    this.world.draw();
  }
}
