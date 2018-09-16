import {
  Container,
  Sprite,
  BitmapText,
  filters,
} from '../const/aliases';

import State from './State';

import { RENDERER_WIDTH, RENDERER_HEIGHT, FONTS } from '../const/app';

export default class GameOverState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);

    this.createSkyBackground();
    this.createTexts(context.gameStatus, context.score);

    if (context.gameStatus === 'failure') {
      context.sounds.fail.play();
    } else {
      context.sounds.tada.play();
    }
  }

  handleEvent(e) {
    super.handleEvent(e);
    if (e.type === 'keyup' && e.keyCode === 32) {
      this.context.gameStatus = '';
      this.context.level = 0;
      this.context.score = 0;
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
      const scoreContainer = new Container();
      textContainer.addChild(scoreContainer);
      const messageText = new BitmapText(`You got Pixie home and collected ${score} stars`, { font: FONTS.xsmall });
      scoreContainer.addChild(messageText);
      const pixie = new Sprite(this.context.textures['pixie-0.png']);
      pixie.x = messageText.width + 10;
      pixie.y = -4;
      scoreContainer.addChild(pixie);
      scoreContainer.x -= scoreContainer.width / 2;
      scoreContainer.y = yPos;
      yPos += messageText.height + 40;

      const ratingContainer = new Container();
      const desatFilter = new filters.ColorMatrixFilter();
      desatFilter.desaturate(false);
      const satFilter = new filters.ColorMatrixFilter();
      satFilter.saturate(1, false);
      for (let i = 0; i < 3; i++) {
        const star = new Sprite(this.context.textures['star.png']);
        star.x = i * (star.width + 10);
        if (score < (i + 1) * 10) {
          star.filters = [desatFilter];
        } else {
          star.filters = [satFilter];
        }
        ratingContainer.addChild(star);
      }
      ratingContainer.x -= ratingContainer.width / 2;
      ratingContainer.y = yPos;
      textContainer.addChild(ratingContainer);
      yPos += ratingContainer.height + 40;
    }

    const hintText = new BitmapText('Press space to go back to menu', { font: FONTS.xsmall });
    hintText.anchor.x = 0.5;
    hintText.y = yPos;
    textContainer.addChild(hintText);

    textContainer.x = RENDERER_WIDTH / 2;
    textContainer.y = RENDERER_HEIGHT / 2 - textContainer.height / 2;
  }
}
