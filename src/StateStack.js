export default class StateStack {
  constructor() {
    this.stack = [];
  }

  push(state) {
    this.stack.push(state);

    for (let previousState of this.stack.slice(0, this.stack.length - 1)) {
      previousState.toggleVisibility();
    }
  }

  pop() {
    if (this.stack.length > 1) {
      this.stack[this.stack.length - 2].show();
    }

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
