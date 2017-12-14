import { BitmapText } from '../const/aliases.js';

import State from './State.js';
import MenuItem from '../gui/MenuItem.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class AboutState extends State {
  constructor(stage, stateStack, textures) {
    super(stage, stateStack, textures);

    this.buildScene();
  }

  buildScene() {
    const texts = [
      'Pixie Perilousness! is an original concept from the',
      'awesome tutorial Learn Pixi.js, available at',
      'github.com/kittykatattack/learnPixiJS.',
      'Please see',
      'github.com/onewittygrassblade/pixi-js-pixie-perilousness',
      'for full credits and source code.'
    ];

    const textSyle = {font: '30px pixie-font'};

    let yPos = 0;

    for (let i = 0; i < texts.length; i++) {
      let bitmapText = new BitmapText(texts[i], textSyle);
      bitmapText.x = RENDERER_WIDTH / 2 - bitmapText.width / 2;
      bitmapText.y = yPos;
      yPos += bitmapText.height + 30;
      this.container.addChild(bitmapText);
    }

    const backToTitle = new MenuItem('Back', {font: '48px pixie-font'});
    backToTitle.on('click', e => {
      this.popFromStack();
    });
    backToTitle.anchor.set(0.5);
    backToTitle.x = RENDERER_WIDTH / 2;
    backToTitle.y = yPos + 40;
    this.container.addChild(backToTitle);

    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }
}
