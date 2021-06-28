import { Container, BitmapText } from '../const/aliases';

import State from './State';
import MenuItem from '../gui/MenuItem';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { FONT_S, FONT_XS } from '../const/fonts';

export default class AboutState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
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
      'for full credits and source code.',
    ];

    let yPos = 35;

    for (let i = 0; i < texts.length; i++) {
      const bitmapText = new BitmapText(texts[i], FONT_XS);
      bitmapText.anchor.x = 0.5;
      bitmapText.y = yPos;
      yPos += bitmapText.height + 30;
      textContainer.addChild(bitmapText);
    }

    const backToTitle = new MenuItem('Back', FONT_S, () => {
      this.stateStack.popState();
      this.stateStack.pushState('TitleState');
    });
    backToTitle.anchor.x = 0.5;
    backToTitle.y = RENDERER_HEIGHT - 120;
    textContainer.addChild(backToTitle);

    textContainer.x = RENDERER_WIDTH / 2;
    textContainer.y = RENDERER_HEIGHT / 2 - textContainer.height / 2;
  }
}
