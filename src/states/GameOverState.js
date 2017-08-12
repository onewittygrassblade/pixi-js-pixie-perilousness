import TitleState from './TitleState.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { Container, TilingSprite, BitmapText } from '../const/aliases.js';

import { rendererWidth, rendererHeight } from '../const/appConstants.js';

export default class GameOverState {
  constructor(stage, stateStack, textures, success) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.createTexts(success);

    this.addKeyControllers();
  }

  createTexts(success) {
    let textContainer = new Container();
    textContainer.x = rendererWidth / 2;

    let messageText = new BitmapText(
      'Whoops!',
      {font: '64px pixie-font'}
    );
    if (success) {
      messageText.text = 'Yay!';
    }
    messageText.anchor.x = 0.5;
    textContainer.addChild(messageText);

    let hintText = new BitmapText(
      'Press space to continue',
      {font: '48px pixie-font'}
    );
    hintText.anchor.x = 0.5;
    hintText.y = messageText.y + messageText.height + 40;
    textContainer.addChild(hintText);

    textContainer.y = rendererHeight / 2 - textContainer.height / 2;
    this.stage.addChild(textContainer);
  }

  addKeyControllers() {
    let restartGame = () => {
      this.restartGameController.remove();

      this.stage.removeChildren(1, this.stage.children.length);

      this.stateStack.pop();
      this.stateStack.push(new TitleState(this.stage, this.stateStack, this.textures));
    }

    this.restartGameController = new KeyBinder(32, null, restartGame);
  }

  update(dt) {
    return false;
  }
}
