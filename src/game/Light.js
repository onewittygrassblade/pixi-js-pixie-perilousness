import { Texture, Sprite } from '../const/aliases.js';

export default class Light {
  constructor(center, size) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = size.x;
    this.canvas.height = size.y;
    this.ctx = this.canvas.getContext('2d');

    this.renderGradient(center);
  }

  renderGradient(center) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let gradient = this.ctx.createRadialGradient(center.x, center.y, 220, center.x, center.y, 30);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'black');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.sprite) {
      this.sprite = new Sprite(new Texture.fromCanvas(this.canvas));
    } else {
      this.sprite.texture.update();
    }
  }
}
