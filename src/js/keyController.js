export default class keyController {
  constructor(keyCode, press = undefined, release = undefined) {
    this.code = keyCode;
    this.isDown = false;
    this.isUp = true;
    this.press = press;
    this.release = release;

    window.addEventListener('keydown', this.downHandler.bind(this), false);
    window.addEventListener('keyup', this.upHandler.bind(this), false);
  }

  downHandler(e) {
    if (e.keyCode === this.code) {
      if (this.isUp && this.press) {
        this.press();
      }
      this.isDown = true;
      this.isUp = false;
    }
    e.preventDefault();
  }

  upHandler(e) {
    if (e.keyCode === this.code) {
      if (this.isDown && this.release) {
        this.release();
      }
      this.isDown = false;
      this.isUp = true;
    }
    e.preventDefault();
  }
}
