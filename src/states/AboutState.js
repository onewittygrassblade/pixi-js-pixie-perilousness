import { Sprite, TilingSprite, Text, TextStyle, BitmapText } from '../const/aliases.js';

import State from './State.js';
import KeyBinder from '../helpers/KeyBinder.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class AboutState extends State {
  constructor(stage, stateStack, textures) {
    super(stage, stateStack, textures);

    this.buildScene();
    this.addKeyControllers();
  }

  buildScene() {
    this.container.addChild(new TilingSprite(this.textures['clouds.png'], RENDERER_WIDTH, RENDERER_HEIGHT));

    let textSyle = new TextStyle({
      fontSize: 24,
      // fontWeight: 'bold',
      fill: 0xe6007e,
      wordWrap: true,
      wordWrapWidth: 760
    });

    let introText = new Text("Pixie Perilousness! is an original concept by Rex Van der Spuy from his tutorial on Pixi.js, available at github.com/kittykatattack/learnPixiJS.", textSyle);
    introText.x = RENDERER_WIDTH / 2 - introText.width / 2;
    introText.y = 80;
    this.container.addChild(introText);

    let returnToMenuText = new BitmapText(
      'Press space to return to menu',
      {font: '26px pixie-font'}
    );
    returnToMenuText.x = RENDERER_WIDTH / 2 - returnToMenuText.width / 2;
    returnToMenuText.y = introText.y + introText.height + 60;
    this.container.addChild(returnToMenuText);
  }

  addKeyControllers() {
    let toMenuState = () => {
      this.toMenuStateController.remove();
      this.pop();
    }

    this.toMenuStateController = new KeyBinder(32, null, toMenuState);
  }
}
