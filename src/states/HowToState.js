import { Container, Sprite, BitmapText } from '../const/aliases';

import State from './State';
import MenuItem from '../gui/MenuItem';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/app';
import { FONT_S, FONT_XS } from '../const/fonts';

export default class HowToState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createTexts();
  }

  createTexts() {
    const textContainer = new Container();
    this.container.addChild(textContainer);

    const data = [
      {
        text: 'Help Pixie get home!',
        sprite: null,
        yOffset: 50,
      },
      {
        text: 'Press space to make Pixie flap her wings',
        sprite: new Sprite(this.context.textures['pixie-0.png']),
        yOffset: 50,
      },
      {
        text: 'Avoid the green blocks',
        sprite: new Sprite(this.context.textures['green-block.png']),
        yOffset: 80,
      },
      {
        text: 'Pick up presents to get surprises',
        sprite: new Sprite(this.context.textures['gift.png']),
        yOffset: 100,
      },
    ];

    let yPos = 35;

    for (let i = 0; i < data.length; i++) {
      const bitmapText = new BitmapText(data[i].text, FONT_XS);

      if (data[i].sprite) {
        bitmapText.x = data[i].sprite.width + 20;
        bitmapText.y = data[i].sprite.height / 2 - bitmapText.height / 2;
        const container = new Container();
        container.addChild(data[i].sprite);
        container.addChild(bitmapText);
        container.x = RENDERER_WIDTH / 2 - container.width / 2;
        container.y = yPos;
        textContainer.addChild(container);
      } else {
        bitmapText.x = RENDERER_WIDTH / 2 - bitmapText.width / 2;
        bitmapText.y = yPos;
        textContainer.addChild(bitmapText);
      }

      yPos += bitmapText.height + data[i].yOffset;
    }

    const backToTitle = new MenuItem('Back', FONT_S, () => {
      this.stateStack.popState();
      this.stateStack.pushState('TitleState');
    });
    backToTitle.x = RENDERER_WIDTH / 2;
    backToTitle.y = RENDERER_HEIGHT - 120;
    textContainer.addChild(backToTitle);

    textContainer.y = RENDERER_HEIGHT / 2 - textContainer.height / 2;
  }
}
