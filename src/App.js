import { loader, resources, Container } from './const/aliases';

import Engine from './Engine';
import StateStack from './StateStack';

import { SOUND_NAMES, STATES, TIME_PER_FRAME } from './const/app';

let lastFrameTimestamp = 0;
let timeSinceLastUpdate = 0;

export default class App {
  constructor() {
    this.engine = new Engine();
    this.stage = new Container();
    this.events = [];
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
    window.addEventListener(
      'keydown',
      e => this.events.push(e),
      false
    );
    window.addEventListener(
      'keyup',
      e => this.events.push(e),
      false
    );

    const { textures } = resources['images/pixie-perilousness.json'];

    const sounds = SOUND_NAMES.reduce((acc, item) => {
      acc[item] = resources[item].data;
      return acc;
    }, {});

    this.stateStack = new StateStack({
      stage: this.stage,
      textures,
      sounds,
      gameStatus: '',
      level: 0,
      score: 0,
    });

    STATES.forEach((state) => {
      this.stateStack.registerState(state);
    });

    this.stateStack.pushState('TitleState');
  }

  run() {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp) {
    timeSinceLastUpdate += timestamp - lastFrameTimestamp;
    lastFrameTimestamp = timestamp;

    while (timeSinceLastUpdate > TIME_PER_FRAME) {
      timeSinceLastUpdate -= TIME_PER_FRAME;
      this.processInput();
      this.stateStack.update(TIME_PER_FRAME);
    }

    this.engine.render(this.stage);

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  processInput() {
    while (this.events.length) {
      this.stateStack.handleEvent(this.events[0]);
      this.events.shift();
    }
  }
}
