import StateStack from './StateStack.js';
import TitleState from './TitleState.js';

import {  autoDetectRenderer, loader, resources, Container } from './const/aliases.js';

import {  timePerFrame, rendererWidth, rendererHeight } from './const/gameConstants.js';

let lastFrameTimestamp = 0;
let timeSinceLastUpdate = 0;

export default class App {
  constructor() {
    this.renderer = autoDetectRenderer(rendererWidth, rendererHeight);
    document.getElementById('root').appendChild(this.renderer.view);

    this.stage = new Container();

    this.stateStack = new StateStack();
  }

  static loadImages() {
    return new Promise((resolve, reject) => {
      loader
      .add('images/pixie-perilousness.json')
      .on('error', reject)
      .load(resolve);
    });
  }

  setup() {
    this.textures = resources['images/pixie-perilousness.json'].textures;
    this.stateStack.push(new TitleState(this.stage, this.stateStack, this.textures));

    this.run();
  }

  run() {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp) {
    timeSinceLastUpdate += timestamp - lastFrameTimestamp;
    lastFrameTimestamp = timestamp;

    while (timeSinceLastUpdate > timePerFrame) {
      timeSinceLastUpdate -= timePerFrame;
      this.stateStack.update(timePerFrame);
    }

    this.renderer.render(this.stage);

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}