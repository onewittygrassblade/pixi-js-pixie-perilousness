import {
  Container,
  Sprite,
  TilingSprite,
  BitmapText
} from '../const/aliases';

import State from './State';
import TitleState from './TitleState';
import KeyBinder from '../helpers/KeyBinder';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants';

export default class GameOverState extends State {
  constructor(stage, stateStack, textures, sounds, success, numberOfStars) {
    super(stage, stateStack, textures, sounds);

    this.container.addChild(new TilingSprite(textures['clouds.png'], RENDERER_WIDTH, RENDERER_HEIGHT));
    this.createTexts(success, numberOfStars);

    this.keyControllers.push(new KeyBinder(32, null, () => {
      this.popFromStack();
      this.stateStack.push(new TitleState(this.stage, this.stateStack, this.textures, this.sounds));
    }));

    if (!success) {
      this.sounds.fail.play();
    }
  }

  createTexts(success, numberOfStars) {
    const textContainer = new Container();
    this.container.addChild(textContainer);

    const resultText = new BitmapText('Whoops!', { font: '64px pixie-font' });
    if (success) {
      resultText.text = 'Congratulations!';
    }
    resultText.anchor.x = 0.5;
    textContainer.addChild(resultText);

    let yPos = resultText.height + 40;

    if (success) {
      const starResultContainer = new Container();
      starResultContainer.addChild(new Sprite(this.textures['star.png']));
      const messageText = new BitmapText(`x ${numberOfStars}`, { font: '48px pixie-font' });
      messageText.x = 60;
      messageText.y = 7;
      starResultContainer.addChild(messageText);
      starResultContainer.x -= starResultContainer.width / 2;
      starResultContainer.y = yPos;
      yPos += messageText.height + 40;
      textContainer.addChild(starResultContainer);
    }

    const hintText = new BitmapText('Press space to continue', { font: '32px pixie-font' });
    hintText.anchor.x = 0.5;
    hintText.y = yPos;
    textContainer.addChild(hintText);

    textContainer.x = RENDERER_WIDTH / 2;
    textContainer.y = RENDERER_HEIGHT / 2 - textContainer.height / 2;
  }
}
