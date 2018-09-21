import { loader, resources, Container } from './const/aliases';

import Engine from './Engine';
import StateStack from './StateStack';
import MusicPlayer from './MusicPlayer';

import {
  SOUNDS,
  MUSICS,
  STATES,
  TIME_PER_FRAME,
} from './const/app';

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
      SOUNDS.forEach((soundName) => {
        loader.add(soundName, `sounds/${soundName}.mp3`);
      });

      MUSICS.forEach((musicName) => {
        loader.add(musicName, `music/${musicName}.mp3`);
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

    const sounds = SOUNDS.reduce((acc, item) => {
      acc[item] = resources[item].sound;
      return acc;
    }, {});

    const musics = MUSICS.reduce((acc, item) => {
      acc[item] = resources[item].sound;
      return acc;
    }, {});

    this.stateStack = new StateStack({
      stage: this.stage,
      textures,
      sounds,
      musicPlayer: new MusicPlayer(musics),
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
