import {
  loader,
  resources,
  Application,
  Sprite,
} from './const/aliases';

import StateStack from './StateStack';
import MusicPlayer from './MusicPlayer';
import Clickable from './gui/Clickable';
import PubSub from './PubSub';
import Sky from './game/Sky';
import centerCanvas from './helpers/centerCanvas';

import {
  SOUNDS,
  MUSICS,
  STATES,
  RENDERER_WIDTH,
  RENDERER_HEIGHT,
} from './const/app';

export default class App extends Application {
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

  constructor() {
    super({ width: RENDERER_WIDTH, height: RENDERER_HEIGHT });
  }

  boot() {
    // Set view
    document.getElementById('root').appendChild(this.view);

    centerCanvas(this.view);
    window.addEventListener('resize', () => {
      centerCanvas(this.view);
    });

    // Load assets
    SOUNDS.forEach((soundName) => {
      loader.add(soundName, `sounds/${soundName}.mp3`);
    });

    MUSICS.forEach((musicName) => {
      loader.add(musicName, `music/${musicName}.mp3`);
    });

    loader
      .add('images/pixie-perilousness.json')
      .add('fonts/pixie-font.fnt')
      .on('error', () => {
        console.err('Loading error'); // eslint-disable-line no-console
      })
      .load(this.handleLoadComplete.bind(this));
  }

  handleLoadComplete() {
    // Create event collectors
    this.events = [];
    window.addEventListener(
      'keydown',
      (e) => this.events.push(e),
      false
    );
    window.addEventListener(
      'keyup',
      (e) => this.events.push(e),
      false
    );

    // Create context
    const { textures } = resources['images/pixie-perilousness.json'];

    const sounds = SOUNDS.reduce((acc, item) => {
      acc[item] = resources[item].sound;
      return acc;
    }, {});

    const musics = MUSICS.reduce((acc, item) => {
      acc[item] = resources[item].sound;
      return acc;
    }, {});

    const background = new Sky(textures['clouds.png'], RENDERER_WIDTH, RENDERER_HEIGHT);
    this.stage.addChild(background.container);

    const context = {
      stage: this.stage,
      textures,
      background,
      sounds,
      musicPlayer: new MusicPlayer(musics),
      gameStatus: '',
      level: 0,
      score: 0,
    };

    // Create state stack
    this.stateStack = new StateStack(context);

    STATES.forEach((state) => {
      this.stateStack.registerState(state);
    });

    // Set up music volume icon
    const volumeIcon = new Sprite(context.textures['volume-loud.png']);
    const renderVolumeIcon = () => {
      const level = context.musicPlayer.isMuted() ? 'mute' : 'loud';
      volumeIcon.texture = context.textures[`volume-${level}.png`];
    };
    Clickable.setup(volumeIcon, () => {
      context.musicPlayer.toggleMuted();
      renderVolumeIcon();
    });
    volumeIcon.position.set(10);

    PubSub.subscribe('pushState', () => {
      this.stage.addChild(volumeIcon); // move volume icon to top
    });

    // Set game loop
    // PIXI.Ticker uses a ratio that is 1 if FPS = 60, 2 if FPS = 2, etc.
    this.ticker.add((fpsRatio) => {
      this.processInput();
      this.stateStack.update((fpsRatio * 1000) / 60); // time per frame = 1000 / 60 ms
    });

    // Start on title state
    this.stateStack.pushState('TitleState');
  }

  processInput() {
    while (this.events.length) {
      this.stateStack.handleEvent(this.events[0]);
      this.events.shift();
    }
  }
}
