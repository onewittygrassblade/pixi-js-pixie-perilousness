import { Container, Sprite, BitmapText } from '../const/aliases.js';

import State from './State.js';
import MenuItem from '../gui/MenuItem.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class HowToState extends State {
  constructor(stage, stateStack, textures) {
    super(stage, stateStack, textures);

    this.buildScene();
  }

  buildScene() {
    const data = [
      {
        text: 'Help Pixie get home!',
        sprite: null,
        yOffset: 60
      },
      {
        text: 'Press space to make Pixie flap her wings',
        sprite: new Sprite(this.textures['pixie-0.png']),
        yOffset: 30
      },
      {
        text: 'Avoid the green blocks',
        sprite: new Sprite(this.textures['greenBlock.png']),
        yOffset: 60
      },
      {
        text: 'Pick up presents to get surprises',
        sprite: new Sprite(this.textures['gift.png']),
        yOffset: 60
      }
    ];

    const textSyle = {font: '30px pixie-font'};

    let yPos = 0;

    for (let i = 0; i < data.length; i++)  {
      let bitmapText = new BitmapText(data[i].text, textSyle);

      if (data[i].sprite) {
        bitmapText.x = data[i].sprite.width + 20;
        bitmapText.y = data[i].sprite.height / 2 - bitmapText.height / 2;
        let container = new Container();
        container.addChild(data[i].sprite);
        container.addChild(bitmapText);
        container.x = RENDERER_WIDTH / 2 - container.width / 2;
        container.y = yPos;
        this.container.addChild(container);
      } else {
        bitmapText.x = RENDERER_WIDTH / 2 - bitmapText.width / 2;
        bitmapText.y = yPos;
        this.container.addChild(bitmapText);
      }

      yPos += bitmapText.height + data[i].yOffset;
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
