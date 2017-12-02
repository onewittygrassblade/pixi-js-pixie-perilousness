import { Container, TilingSprite, BitmapText } from '../const/aliases.js';

import State from './State.js';
import TitleState from './TitleState.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class GameOverState extends State {
  constructor(stage, stateStack, textures, sounds, success) {
    super(stage, stateStack, textures, sounds);

    this.createTexts(success);

    this.keyControllers.push(new KeyBinder(32, null, () => {
      this.popFromStack();
      this.stateStack.push(new TitleState(this.stage, this.stateStack, this.textures, this.sounds));
    }));

    this.sounds.fail.play();
  }

  createTexts(success) {
    let messageText = new BitmapText(
      'Whoops!',
      {font: '64px pixie-font'}
    );
    if (success) {
      messageText.text = 'Yay!';
    }
    messageText.anchor.x = 0.5;
    this.container.addChild(messageText);

    let hintText = new BitmapText(
      'Press space to continue',
      {font: '48px pixie-font'}
    );
    hintText.anchor.x = 0.5;
    hintText.y = messageText.y + messageText.height + 40;
    this.container.addChild(hintText);

    this.container.x = RENDERER_WIDTH / 2;
    this.container.y = RENDERER_HEIGHT / 2 - this.container.height / 2;
  }
}
