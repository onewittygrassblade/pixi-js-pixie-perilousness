import { loader, resources, Container } from './const/aliases.js';

import Engine from './Engine.js';
import StateStack from './StateStack.js';
import TitleState from './states/TitleState.js';
import centerCanvas from './helpers/centerCanvas.js';

import {  SOUND_NAMES, RENDERER_WIDTH, RENDERER_HEIGHT, TIME_PER_FRAME  } from './const/appConstants.js';

let lastFrameTimestamp = 0;
let timeSinceLastUpdate = 0;

export default class App {
  constructor() {
    this.engine = new Engine();
    this.stage = new Container();
    this.stateStack = new StateStack();
  }

  static loadAssets() {
    return new Promise((resolve, reject) => {
      for (let soundName of SOUND_NAMES) {
        loader.add(soundName, 'sounds/' + soundName + '.mp3');
      }

      loader
      .add('images/pixie-perilousness.json')
      .add('fonts/pixie-font.fnt')
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

    this.stateStack.push(new TitleState(this.stage, this.stateStack, textures, sounds));

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp) {
    timeSinceLastUpdate += timestamp - lastFrameTimestamp;
    lastFrameTimestamp = timestamp;

    while (timeSinceLastUpdate > TIME_PER_FRAME) {
      timeSinceLastUpdate -= TIME_PER_FRAME;
      this.stateStack.update(TIME_PER_FRAME);
    }

    this.engine.render(this.stage);

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
