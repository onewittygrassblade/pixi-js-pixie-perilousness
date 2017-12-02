import {  autoDetectRenderer } from './const/aliases.js';

import centerCanvas from './helpers/centerCanvas.js';

import {  RENDERER_WIDTH, RENDERER_HEIGHT } from './const/appConstants.js';

export default class Engine {
  constructor() {
    this.renderer = autoDetectRenderer(RENDERER_WIDTH, RENDERER_HEIGHT);
    document.getElementById('root').appendChild(this.renderer.view);

    centerCanvas(this.renderer.view);
    window.addEventListener('resize', event => {
      centerCanvas(this.renderer.view);
    });
  }

  render(stage) {
    this.renderer.render(stage);
  }
}
