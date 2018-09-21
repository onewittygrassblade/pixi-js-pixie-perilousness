import { Container, BitmapText } from '../const/aliases';

import State from './State';
import MenuItem from '../gui/MenuItem';

import { RENDERER_WIDTH, RENDERER_HEIGHT, FONTS } from '../const/app';

export default class TitleState extends State {
  constructor(stateStack, context) {
    super(stateStack, context);
    this.createSkyBackground();
    this.createTitle();
    this.createMenu();
    this.context.musicPlayer.play('hyperfun');
  }

  createTitle() {
    const title = new BitmapText('Pixie Perilousness!', { font: FONTS.large });
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
      callback: () => this.stateStack.pushState('HowToState'),
    }, {
      title: 'About',
      callback: () => this.stateStack.pushState('AboutState'),
    }];

    let yPos = 0;

    menuItemData.forEach((data) => {
      const menuItem = new MenuItem(data.title, { font: FONTS.small }, data.callback);
      menuItem.y = yPos;
      yPos += menuItem.height + 20;
      menuContainer.addChild(menuItem);
    });
  }

  startGame() {
    this.stateStack.popState();
    this.stateStack.pushState('GameState');
    this.stateStack.pushState('HintState');
  }
}
