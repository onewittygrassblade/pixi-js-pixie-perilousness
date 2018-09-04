import { Container } from '../const/aliases';

export default class State {
  constructor(stage, stateStack, textures = null, sounds = null) {
    this.stage = stage;
    this.stateStack = stateStack;
    this.textures = textures;
    this.sounds = sounds;

    this.keyControllers = [];

    this.container = new Container();
    this.stage.addChild(this.container);
  }

  show() {
    this.container.visible = true;
  }

  hide() {
    this.container.visible = false;
  }

  shouldBeHiddenWhenPushedUnder() {
    return false;
  }

  addEventListeners() {
    this.keyControllers.forEach((controller) => {
      controller.addEventListeners();
    });
  }

  removeEventListeners() {
    this.keyControllers.forEach((controller) => {
      controller.removeEventListeners();
    });
  }

  shouldRemoveEventListenersWhenPushedUnder() {
    return true;
  }

  popFromStack() {
    this.removeEventListeners();
    this.stage.removeChild(this.container);
    this.stateStack.pop();
  }

  update() {
    return false;
  }
}
