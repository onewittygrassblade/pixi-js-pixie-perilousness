export default class keyController {
  constructor(keyCode, press = undefined, release = undefined) {
    this.code = keyCode;
    this.press = press;
    this.release = release;

    window.addEventListener('keydown', this.downHandler.bind(this), false);
    window.addEventListener('keyup', this.upHandler.bind(this), false);
  }

  downHandler(e) {
    if (e.keyCode === this.code && this.press) {
      this.press();
    }
    e.preventDefault();
  }

  upHandler(e) {
    if (e.keyCode === this.code && this.release) {
      this.release();
    }
    e.preventDefault();
  }
}
