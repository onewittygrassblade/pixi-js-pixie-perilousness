import MenuItem from './MenuItem.js';
import GameState from './GameState.js';
import HintState from './HintState.js';

import { Container, BitmapText } from './const/aliases.js';

import { rendererWidth, rendererHeight } from './const/appConstants.js';
import { levelsData } from './const/levelsData.js';

export default class TitleState {
  constructor(stage, stateStack, textures) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.createTitle();
    this.createMenu();
  }

  createTitle() {
    let title = new BitmapText(
      'Pixie Perilousness!',
      {font: '72px pixie-font'}
    );
    title.x = rendererWidth / 2 - title.width / 2;
    title.y = 120;
    this.stage.addChild(title);
  }

  createMenu() {
    let menuContainer = new Container();
    menuContainer.x = rendererWidth / 2 - menuContainer.width / 2;
    menuContainer.y = rendererHeight / 2 - menuContainer.height / 2;
    this.stage.addChild(menuContainer);

    let menuItemStyle = {font: '48px pixie-font'};

    let play = new MenuItem('Play', menuItemStyle);
    play.on('click', e => {
      this.startGame();
    });
    menuContainer.addChild(play);

    let about = new MenuItem('About', menuItemStyle);
    about.y = play.height + 20;
    menuContainer.addChild(about);

    let credits = new MenuItem('Credits', menuItemStyle);
    credits.y = about.y + about.height + 20;
    menuContainer.addChild(credits);
  }

  startGame() {
    this.stage.removeChildren(1, this.stage.children.length);

    this.stateStack.pop();
    let gameState = new GameState(this.stage, this.stateStack, this.textures);
    this.stateStack.push(gameState);
    this.stateStack.push(new HintState(this.stage, this.stateStack, gameState, 1, levelsData[0].hintData));
  }

  update(dt) {
    return false;
  }
}
