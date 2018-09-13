import { Container, TilingSprite } from '../const/aliases';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';

export default class State {
  constructor(stateStack, context) {
    this.stateStack = stateStack;
    this.context = context;
    this.container = new Container();
    context.stage.addChild(this.container);
  }

  createSkyBackground() {
    this.container.addChild(
      new TilingSprite(
        this.context.textures['clouds.png'],
        RENDERER_WIDTH,
        RENDERER_HEIGHT
      )
    );
  }

  /* eslint-disable class-methods-use-this */
  handleEvent(e) {
    e.preventDefault();
  }

  update() {
    return false;
  }
  /* eslint-enable class-methods-use-this */
}
