export default class KeyBinder {
  constructor(keyCode, press = undefined, release = undefined) {
    this.code = keyCode;
    this.press = press;
    this.release = release;
    this.downHandler = this.downHandler.bind(this);
    this.upHandler = this.upHandler.bind(this);

    window.addEventListener('keydown', this.downHandler, false);
    window.addEventListener('keyup', this.upHandler, false);
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

  remove() {
    window.removeEventListener('keydown', this.downHandler, false);
    window.removeEventListener('keyup', this.upHandler, false);
  }
}