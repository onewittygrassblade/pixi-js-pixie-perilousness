import { Texture, Sprite } from '../const/aliases';

export default class Light {
  constructor(sizeX, sizeY) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = sizeX;
    this.canvas.height = sizeY;
    this.ctx = this.canvas.getContext('2d');
  }

  renderGradient(centerX, centerY) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const gradient = this.ctx.createRadialGradient(centerX, centerY, 230, centerX, centerY, 30);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'black');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.sprite) {
      this.sprite = new Sprite(new Texture.from(this.canvas)); // eslint-disable-line new-cap
    } else {
      this.sprite.texture.update();
    }
  }
}
