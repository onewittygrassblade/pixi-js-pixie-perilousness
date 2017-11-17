import { Container, BitmapText } from '../const/aliases.js';

import State from './State.js';
import MenuItem from '../gui/MenuItem.js';
import GameState from './GameState.js';
import HintState from './HintState.js';
import HowToState from './HowToState.js';
import AboutState from './AboutState.js';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants.js';

export default class TitleState extends State {
  constructor(stage, stateStack, textures, sounds) {
    super(stage, stateStack, textures, sounds);

    this.createTitle();
    this.createMenu();
  }

  createTitle() {
    let title = new BitmapText(
      'Pixie Perilousness!',
      {font: '72px pixie-font'}
    );
    title.x = RENDERER_WIDTH / 2 - title.width / 2;
    title.y = 120;
    this.stage.addChild(title);
  }

  createMenu() {
    let menuContainer = new Container();
    menuContainer.x = RENDERER_WIDTH / 2 - menuContainer.width / 2;
    menuContainer.y = RENDERER_HEIGHT / 2 - menuContainer.height / 2;
    this.stage.addChild(menuContainer);

    let menuItemStyle = {font: '48px pixie-font'};

    let play = new MenuItem('Play', menuItemStyle);
    play.on('click', e => {
      this.startGame();
    });
    menuContainer.addChild(play);

    let howto = new MenuItem('How to play', menuItemStyle);
    howto.y = play.height + 20;
    howto.on('click', e => {
      this.showHowToPlay();
    });
    menuContainer.addChild(howto);

    let about = new MenuItem('About', menuItemStyle);
    about.y = howto.y + howto.height + 20;
    about.on('click', e => {
      this.showAbout();
    });
    menuContainer.addChild(about);
  }

  startGame() {
    this.stage.removeChildren(1, this.stage.children.length);

    this.stateStack.pop();
    let gameState = new GameState(this.stage, this.stateStack, this.textures, this.sounds);
    this.stateStack.push(gameState);
    this.stateStack.push(new HintState(this.stage, this.stateStack, gameState, 'Level 1'));
  }

  showHowToPlay() {
    this.stateStack.push(new HowToState(this.stage, this.stateStack, this.textures));
  }

  showAbout() {
    this.stateStack.push(new AboutState(this.stage, this.stateStack, this.textures));
  }
}
