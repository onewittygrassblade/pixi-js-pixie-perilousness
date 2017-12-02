import { BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class AboutState extends State {
  constructor(stage, stateStack, textures) {
    super(stage, stateStack, textures);

    this.buildScene();
    this.addKeyControllers();
  }

  buildScene() {
    const texts = [
      'Pixie Perilousness! is an original concept from the',
      'awesome tutorial Learn Pixi.js, available at',
      'github.com/kittykatattack/learnPixiJS.',
      'Please see',
      'github.com/onewittygrassblade/pixi-js-pixie-perilousness',
      'for full credits and source code.',
      'Press space to return to menu'
    ];

    const textSyle = {font: '30px pixie-font'};

    let yPos = 0;

    for (let i = 0; i < texts.length; i++) {
      let bitmapText = new BitmapText(texts[i], textSyle);
      bitmapText.x = RENDERER_WIDTH / 2 - bitmapText.width / 2;
      bitmapText.y = yPos;
      yPos += bitmapText.height + (i != texts.length - 2 ? 20 : 60);
      this.container.addChild(bitmapText);
    }

    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }

  addKeyControllers() {
    let toMenuState = () => {
      this.toMenuStateController.remove();
      this.popFromStack();
    }

    this.toMenuStateController = new KeyBinder(32, null, toMenuState);
  }
}
