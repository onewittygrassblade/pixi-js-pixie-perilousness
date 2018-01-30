import { Container, TilingSprite, Sprite, BitmapText } from '../const/aliases.js';

import State from './State.js';
import MenuItem from '../gui/MenuItem.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class HowToState extends State {
  constructor(stage, stateStack, textures) {
    super(stage, stateStack, textures);

    this.container.addChild(new TilingSprite(textures['clouds.png'], RENDERER_WIDTH, RENDERER_HEIGHT));
    this.createTexts();
  }

  createTexts() {
    const textContainer = new Container();
    this.container.addChild(textContainer);

    const data = [
      {
        text: 'Help Pixie get home!',
        sprite: null,
        yOffset: 50
      },
      {
        text: 'Press space to make Pixie flap her wings',
        sprite: new Sprite(this.textures['pixie-0.png']),
        yOffset: 50
      },
      {
        text: 'Avoid the green blocks',
        sprite: new Sprite(this.textures['greenBlock.png']),
        yOffset: 80
      },
      {
        text: 'Pick up presents to get surprises',
        sprite: new Sprite(this.textures['gift.png']),
        yOffset: 100
      }
    ];

    let yPos = 0;

    for (let i = 0; i < data.length; i++)  {
      let bitmapText = new BitmapText(data[i].text, {font: '30px pixie-font'});

      if (data[i].sprite) {
        bitmapText.x = data[i].sprite.width + 20;
        bitmapText.y = data[i].sprite.height / 2 - bitmapText.height / 2;
        let container = new Container();
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

    const backToTitle = new MenuItem('Back', {font: '48px pixie-font'});
    backToTitle.on('click', e => {
      this.popFromStack();
    });
    backToTitle.x = RENDERER_WIDTH / 2;
    backToTitle.y = yPos;;
    textContainer.addChild(backToTitle);

    textContainer.y = RENDERER_HEIGHT / 2 - textContainer.height / 2;
  }
}
