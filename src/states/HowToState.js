import { Container, Sprite, BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class HowToState extends State {
  constructor(stage, stateStack, textures) {
    super(stage, stateStack, textures);

    this.buildScene();

    this.keyControllers.push(new KeyBinder(32, null, () => {
      this.popFromStack();
    }));
  }

  buildScene() {
    const data = [
      {
        text: 'Help Pixie find teddy bears among the scattered presents!',
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
        text: 'Pick up presents to get teddy bears or surprises',
        sprite: new Sprite(this.textures['gift.png']),
        yOffset: 60
      },
      {
        text: 'Press space to return to menu',
        sprite: null,
        yOffset: 0
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

    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }
}
