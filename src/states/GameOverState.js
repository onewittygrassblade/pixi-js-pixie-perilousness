import { Container, Sprite, BitmapText } from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH, RENDERER_HEIGHT, FONTS } from '../const/app';

export default class GameOverState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);

    this.createSkyBackground();
    this.createTexts(context.gameStatus, context.score);

    if (context.gameStatus === 'failure') {
      context.sounds.fail.play();
    }
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 32) {
      this.stateStack.clearStates();
      this.stateStack.pushState('TitleState');
    }

    return false;
  }

  createTexts(gameStatus, score) {
    const textContainer = new Container();
    this.container.addChild(textContainer);

    const resultText = new BitmapText('Whoops!', { font: FONTS.medium });
    if (gameStatus === 'success') {
      resultText.text = 'Congratulations!';
    }
    resultText.anchor.x = 0.5;
    textContainer.addChild(resultText);

    let yPos = resultText.height + 40;

    if (gameStatus === 'success') {
      const starResultContainer = new Container();
      starResultContainer.addChild(new Sprite(this.context.textures['star.png']));
      const messageText = new BitmapText(`x ${score}`, { font: FONTS.small });
      messageText.x = 60;
      messageText.y = 7;
      starResultContainer.addChild(messageText);
      starResultContainer.x -= starResultContainer.width / 2;
      starResultContainer.y = yPos;
      yPos += messageText.height + 40;
      textContainer.addChild(starResultContainer);
    }

    const hintText = new BitmapText('Press space to continue', { font: FONTS.xsmall });
    hintText.anchor.x = 0.5;
    hintText.y = yPos;
    textContainer.addChild(hintText);

    textContainer.x = RENDERER_WIDTH / 2;
    textContainer.y = RENDERER_HEIGHT / 2 - textContainer.height / 2;
  }
}
