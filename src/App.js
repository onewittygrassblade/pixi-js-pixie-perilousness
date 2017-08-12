import StateStack from './StateStack.js';
import TitleState from './states/TitleState.js';

import {  autoDetectRenderer, loader, resources, Container, TilingSprite } from './const/aliases.js';

import {  timePerFrame, rendererWidth, rendererHeight } from './const/appConstants.js';

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

  static loadFonts() {
    return new Promise((resolve, reject) => {
      loader
      .add('fonts/pixie-font.fnt')
      .on('error', reject)
      .load(resolve);
    });
  }

  static loadSounds() {
    const sounds = {
      bang: 'sounds/bang.mp3',
      fire: 'sounds/fire.mp3',
      metal: 'sounds/metal.mp3',
      pickup: 'sounds/pickup.mp3',
      powerup: 'sounds/powerup.mp3',
      tada: 'sounds/tada.mp3',
      whoosh: 'sounds/whoosh.mp3'
    };

    return new Promise((resolve, reject) => {
      for (let soundName in sounds) {
        loader
        .add(soundName, sounds[soundName]);
      }
      loader
      .on('error', reject)
      .load(resolve);
    });
  }

  setup() {
    const textures = resources['images/pixie-perilousness.json'].textures;
    this.stage.addChild(new TilingSprite(textures['clouds.png'], rendererWidth, rendererHeight));

    const sounds = {
      bang: resources.bang.data,
      fire: resources.fire.data,
      metal: resources.metal.data,
      pickup: resources.pickup.data,
      powerup: resources.powerup.data,
      tada: resources.tada.data,
      whoosh: resources.whoosh.data
    };

    this.stateStack.push(new TitleState(this.stage, this.stateStack, textures, sounds));

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
