import { Container, TilingSprite, BitmapText } from '../const/aliases';

import State from './State';
import MenuItem from '../gui/MenuItem';
import GameState from './GameState';
import HintState from './HintState';
import HowToState from './HowToState';
import AboutState from './AboutState';

import { RENDERER_WIDTH, RENDERER_HEIGHT } from '../const/appConstants';

export default class TitleState extends State {
  constructor(stage, stateStack, textures, sounds) {
    super(stage, stateStack, textures, sounds);

    this.container.addChild(new TilingSprite(textures['clouds.png'], RENDERER_WIDTH, RENDERER_HEIGHT));
    this.createTitle();
    this.createMenu();
  }

  createTitle() {
    const title = new BitmapText('Pixie Perilousness!', { font: '72px pixie-font' });
    title.x = RENDERER_WIDTH / 2 - title.width / 2;
    title.y = 120;
    this.container.addChild(title);
  }

  createMenu() {
    const menuContainer = new Container();
    menuContainer.x = RENDERER_WIDTH / 2 - menuContainer.width / 2;
    menuContainer.y = RENDERER_HEIGHT / 2 - menuContainer.height / 2;
    this.container.addChild(menuContainer);

    const menuItemData = [{
      title: 'Play',
      callback: this.startGame.bind(this),
    }, {
      title: 'How to play',
      callback: this.showHowToPlay.bind(this),
    }, {
      title: 'About',
      callback: this.showAbout.bind(this),
    }];

    let yPos = 0;

    menuItemData.forEach((data) => {
      const menuItem = new MenuItem(data.title, { font: '48px pixie-font' });
      menuItem.on('click', () => {
        data.callback();
      });
      menuItem.y = yPos;
      yPos += menuItem.height + 20;
      menuContainer.addChild(menuItem);
    });
  }

  startGame() {
    this.popFromStack();

    const gameState = new GameState(this.stage, this.stateStack, this.textures, this.sounds);
    this.stateStack.push(gameState);
    this.stateStack.push(new HintState(this.stage, this.stateStack, 'Hello Pixie!'));
  }

  showHowToPlay() {
    this.stateStack.push(new HowToState(this.stage, this.stateStack, this.textures));
  }

  showAbout() {
    this.stateStack.push(new AboutState(this.stage, this.stateStack, this.textures));
  }

  shouldBeHiddenWhenPushedUnder() {
    return true;
  }
}
