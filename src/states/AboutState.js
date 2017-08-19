import KeyBinder from '../helpers/KeyBinder.js';

import { Container, Sprite, Text, TextStyle, BitmapText } from '../const/aliases.js';

import { rendererWidth, rendererHeight } from '../const/appConstants.js';

export default class AboutState {
  constructor(stage, stateStack, textures) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.buildScene();

    this.addKeyControllers();
  }

  buildScene() {
    this.stage.addChild(new Sprite(this.textures['scroll.png']));

    let textSyle = new TextStyle({
      fontSize: 24,
      // fontWeight: 'bold',
      fill: 0xe6007e,
      wordWrap: true,
      wordWrapWidth: 760
    });

    let introText = new Text("Pixie Perilousness! is an original concept by Rex Van der Spuy from his tutorial on Pixi.js, available at github.com/kittykatattack/learnPixiJS.", textSyle);
    introText.x = rendererWidth / 2 - introText.width / 2;
    introText.y = 80;
    this.stage.addChild(introText);

    let returnToMenuText = new BitmapText(
      'Press space to return to menu',
      {font: '26px pixie-font'}
    );
    returnToMenuText.x = rendererWidth / 2 - returnToMenuText.width / 2;
    returnToMenuText.y = introText.y + introText.height + 60;
    this.stage.addChild(returnToMenuText);
  }

  addKeyControllers() {
    let toMenuState = () => {
      this.toMenuStateController.remove();
      this.stage.removeChildren(this.stage.children.length - 3, this.stage.children.length);
      this.stateStack.pop();
    }

    this.toMenuStateController = new KeyBinder(32, null, toMenuState);
  }

  update(dt) {
    return false;
  }
}
