import {  autoDetectRenderer, loader, resources, Container, TilingSprite } from './const/aliases.js';

import StateStack from './StateStack.js';
import TitleState from './states/TitleState.js';

import {  TIME_PER_FRAME, RENDERER_WIDTH, RENDERER_HEIGHT, SOUND_NAMES } from './const/appConstants.js';

let lastFrameTimestamp = 0;
let timeSinceLastUpdate = 0;

export default class App {
  constructor() {
    this.renderer = autoDetectRenderer(RENDERER_WIDTH, RENDERER_HEIGHT);
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

  static loadFont() {
    return new Promise((resolve, reject) => {
      loader
      .add('fonts/pixie-font.fnt')
      .on('error', reject)
      .load(resolve);
    });
  }

  static loadSounds() {
    return new Promise((resolve, reject) => {
      for (let soundName of SOUND_NAMES) {
        loader.add(soundName, 'sounds/' + soundName + '.mp3');
      }

      loader
      .on('error', reject)
      .load(resolve);
    });
  }

  setup() {
    const textures = resources['images/pixie-perilousness.json'].textures;

    const sounds = SOUND_NAMES.reduce((acc, item) => {
      acc[item] = resources[item].data;
      return acc;
    }, {});

    this.stage.addChild(new TilingSprite(textures['clouds.png'], RENDERER_WIDTH, RENDERER_HEIGHT));

    this.stateStack.push(new TitleState(this.stage, this.stateStack, textures, sounds));

    this.run();
  }

  run() {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp) {
    timeSinceLastUpdate += timestamp - lastFrameTimestamp;
    lastFrameTimestamp = timestamp;

    while (timeSinceLastUpdate > TIME_PER_FRAME) {
      timeSinceLastUpdate -= TIME_PER_FRAME;
      this.stateStack.update(TIME_PER_FRAME);
    }

    this.renderer.render(this.stage);

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
