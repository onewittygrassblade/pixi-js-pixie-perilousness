import { BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class HintState extends State {
  constructor(stage, stateStack, parent, message) {
    super(stage, stateStack, null, null, parent);

    this.parent.removeKeyControllers();
    this.parent.world.removeKeyControllers();

    this.createText(message);
    this.addKeyControllers();
  }

  createText(message) {
    let messageText = new BitmapText(message, {font: '64px pixie-font'});
    messageText.x = RENDERER_WIDTH / 2 - messageText.width / 2;
    messageText.y = RENDERER_HEIGHT / 2 - messageText.height / 2;
    this.container.addChild(messageText);
  }

  addKeyControllers() {
    let startGame = () => {
      this.startGameController.remove();

      this.parent.addKeyControllers();
      this.parent.world.addKeyControllers();

      this.pop();
    }

    this.startGameController = new KeyBinder(32, null, startGame);
  }
}
