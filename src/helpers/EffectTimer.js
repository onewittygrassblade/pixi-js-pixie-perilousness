export default class EffectTimer {
  constructor() {
    this.timers = [];
  }

  setTimeout(callback, finalTime) {
    this.timers.push({
      time: 0,
      finalTime: finalTime,
      callback: callback
    });
  }

  update(dt) {
    for (let timer of this.timers) {
      if (timer.time < timer.finalTime) {
        timer.time += dt;
      } else {
        timer.callback();
        this.timers.splice(this.timers.indexOf(timer), 1);
      }
    }
  }
}
