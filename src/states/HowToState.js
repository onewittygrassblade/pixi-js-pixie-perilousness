import { Container, Sprite, BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class HowToState extends State {
  constructor(stage, stateStack, textures) {
    super(stage, stateStack, textures);

    this.buildScene();
    this.addKeyControllers();
  }

  buildScene() {
    let textSyle = {font: '26px pixie-font'};

    // game goal text
    let goalText = new BitmapText(
      'Help Pixie find teddy bears among the scattered presents!',
      textSyle
    );
    goalText.x = RENDERER_WIDTH / 2 - goalText.width / 2;
    goalText.y = 80;
    this.container.addChild(goalText);

    // pixie
    let pixieContainer = new Container();
    let pixieSprite = new Sprite(this.textures['pixie-0.png']);
    pixieContainer.addChild(pixieSprite);
    let pixieText = new BitmapText(
      'Press space to make Pixie flap her wings',
      textSyle
    );
    pixieText.x = pixieSprite.width + 20;
    pixieText.y = pixieSprite.height / 2 - pixieText.height / 2;
    pixieContainer.addChild(pixieText);
    pixieContainer.x = RENDERER_WIDTH / 2 - pixieContainer.width / 2;
    pixieContainer.y = goalText.y + goalText.height + 60;
    this.container.addChild(pixieContainer);

    // block
    let blockContainer = new Container();
    let blockSprite = new Sprite(this.textures['greenBlock.png']);
    blockContainer.addChild(blockSprite);
    let blockText = new BitmapText(
      'Avoid the green blocks',
      textSyle
    );
    blockText.x = blockSprite.width + 20;
    blockText.y = blockSprite.height / 2 - blockText.height / 2;
    blockContainer.addChild(blockText);
    blockContainer.x = RENDERER_WIDTH / 2 - blockContainer.width / 2;
    blockContainer.y = pixieContainer.y + pixieContainer.height + 30;
    this.container.addChild(blockContainer);

    // gift
    let giftContainer = new Container();
    let giftSprite = new Sprite(this.textures['gift.png']);
    giftContainer.addChild(giftSprite);
    let giftText = new BitmapText(
      'Pick up presents to get teddy bears or surprises',
      textSyle
    );
    giftText.x = giftSprite.width + 20;
    giftText.y = giftSprite.height / 2 - giftText.height / 2 + 3;
    giftContainer.addChild(giftText);
    giftContainer.x = RENDERER_WIDTH / 2 - giftContainer.width / 2;
    giftContainer.y = blockContainer.y + blockContainer.height + 30;
    this.container.addChild(giftContainer);

    // return to menu text
    let returnToMenuText = new BitmapText(
      'Press space to return to menu',
      textSyle
    );
    returnToMenuText.x = RENDERER_WIDTH / 2 - returnToMenuText.width / 2;
    returnToMenuText.y = giftContainer.y + giftContainer.height + 60;
    this.container.addChild(returnToMenuText);
  }

  addKeyControllers() {
    let toMenuState = () => {
      this.toMenuStateController.remove();
      this.popFromStack();
    }

    this.toMenuStateController = new KeyBinder(32, null, toMenuState);
  }
}
