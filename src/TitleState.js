import GameState from './GameState.js';
import HintState from './HintState.js';
import KeyBinder from './KeyBinder.js';

import { TilingSprite, BitmapText } from './const/aliases.js';

import { rendererWidth, rendererHeight, levelsData } from './const/gameConstants.js';

export default class TitleState {
  constructor(stage, stateStack, textures) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;

    this.buildScene();

    this.addKeyControllers();
  }

  buildScene() {
    let sky = new TilingSprite(this.textures['clouds.png'], rendererWidth, rendererHeight);
    this.stage.addChild(sky);

    let title = new BitmapText(
      'Pixie Perilousness!',
      {font: '72px pixie-font'}
    );
    title.x = rendererWidth / 2 - title.width / 2;
    title.y = rendererHeight / 2 - title.height / 2 - 40;
    this.stage.addChild(title);

    let hint = new BitmapText(
      'Press space to start',
      {font: '48px pixie-font'}
    );
    hint.x = rendererWidth / 2 - hint.width / 2;
    hint.y = title.y + 100;
    this.stage.addChild(hint);
  }

  addKeyControllers() {
    let startGame = () => {
      this.startGameController.remove();

      this.stage.removeChildren(1, this.stage.children.length);

      this.stateStack.pop();
      let gameState = new GameState(this.stage, this.stateStack, this.textures);
      this.stateStack.push(gameState);
      this.stateStack.push(new HintState(this.stage, this.stateStack, gameState, 1, levelsData[0].hintData));
    }

    this.startGameController = new KeyBinder(32, null, startGame);
  }

  update(dt) {
    return false;
  }
}
