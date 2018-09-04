import { loader, resources, Container } from './const/aliases';

import Engine from './Engine';
import StateStack from './StateStack';
import TitleState from './states/TitleState';

import { SOUND_NAMES, TIME_PER_FRAME } from './const/appConstants';

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
      SOUND_NAMES.forEach((soundName) => {
        loader.add(soundName, `sounds/${soundName}.mp3`);
      });

      loader
        .add('images/pixie-perilousness.json')
        .add('fonts/pixie-font.fnt')
        .on('error', reject)
        .load(resolve);
    });
  }

  setup() {
    const { textures } = resources['images/pixie-perilousness.json'];

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
