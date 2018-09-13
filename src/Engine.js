import { autoDetectRenderer } from './const/aliases';

import centerCanvas from './helpers/centerCanvas';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from './const/app';

export default class Engine {
  constructor() {
    this.renderer = autoDetectRenderer(RENDERER_WIDTH, RENDERER_HEIGHT);
    document.getElementById('root').appendChild(this.renderer.view);

    centerCanvas(this.renderer.view);
    window.addEventListener('resize', () => {
      centerCanvas(this.renderer.view);
    });
  }

  render(stage) {
    this.renderer.render(stage);
  }
}
