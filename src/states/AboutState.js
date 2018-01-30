import { Container, TilingSprite, BitmapText } from '../const/aliases.js';

import State from './State.js';
import MenuItem from '../gui/MenuItem.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class AboutState extends State {
  constructor(stage, stateStack, textures) {
    super(stage, stateStack, textures);

    this.container.addChild(new TilingSprite(textures['clouds.png'], RENDERER_WIDTH, RENDERER_HEIGHT));
    this.createTexts();
  }

  createTexts() {
    const textContainer = new Container();
    this.container.addChild(textContainer);

    const texts = [
      'Pixie Perilousness! is an original concept from the',
      'awesome tutorial Learn Pixi.js, available at',
      'github.com/kittykatattack/learnPixiJS.',
      'Please see',
      'github.com/onewittygrassblade/pixi-js-pixie-perilousness',
      'for full credits and source code.'
    ];

    let yPos = 0;

    for (let i = 0; i < texts.length; i++) {
      let bitmapText = new BitmapText(texts[i], {font: '30px pixie-font'});
      bitmapText.anchor.x = 0.5;
      bitmapText.y = yPos;
      yPos += bitmapText.height + 30;
      textContainer.addChild(bitmapText);
    }

    const backToTitle = new MenuItem('Back', {font: '48px pixie-font'});
    backToTitle.on('click', e => {
      this.popFromStack();
    });
    backToTitle.anchor.x = 0.5;
    backToTitle.y = yPos + 40;
    textContainer.addChild(backToTitle);

    textContainer.x = RENDERER_WIDTH / 2;
    textContainer.y = RENDERER_HEIGHT / 2 - textContainer.height / 2;
  }
}
