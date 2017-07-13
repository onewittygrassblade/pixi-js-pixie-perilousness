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
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (!this.stack[i].update(dt)) {
        break;
      }
    }
  }
}
