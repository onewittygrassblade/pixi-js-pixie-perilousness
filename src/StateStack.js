export default class StateStack {
  constructor() {
    this.stack = [];
  }

  push(state) {
    this.stack.push(state);
  }

  pop() {
    return this.stack.pop();
  }

  update(dt) {
    for (let state of this.stack) {
      if (!state.update(dt)) {
        break;
      }
    }
  }
}
