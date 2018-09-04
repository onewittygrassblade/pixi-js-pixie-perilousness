export default class StateStack {
  constructor() {
    this.stack = [];
  }

  push(state) {
    this.stack.push(state);
    state.addEventListeners();

    const previousStates = this.stack.slice(0, this.stack.length - 1);
    previousStates.forEach((previousState) => {
      if (previousState.shouldBeHiddenWhenPushedUnder()) {
        previousState.hide();
      }
      if (previousState.shouldRemoveEventListenersWhenPushedUnder()) {
        previousState.removeEventListeners();
      }
    });
  }

  pop() {
    const previousStates = this.stack.slice(0, this.stack.length - 1);
    previousStates.forEach((previousState) => {
      if (previousState.shouldBeHiddenWhenPushedUnder()) {
        previousState.show();
      }
      if (previousState.shouldRemoveEventListenersWhenPushedUnder()) {
        previousState.addEventListeners();
      }
    });

    return this.stack.pop();
  }

  update(dt) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (!this.stack[i].update(dt)) {
        break;
      }
    }
  }
}
