import Entity from './Entity.js';

export default class Pixie extends Entity {
  constructor(textureFrames, x, y, ay) {
    super(textureFrames, x, y, 0, 0, 0, ay);

    this.animationSpeed = 0.4;

    this.wingPower = -0.001;
    this.addedGravity = 0;
    this.onFire = false;
  }

  gainWeight(sprite) {
    sprite.anchor.set(0.5);
    sprite.y = 35;
    this.addChild(sprite);

    sprite.currentLifetime = 0;
    sprite.lifetime = 10000;

    this.addedGravity = 0.00025;
  }

  gainBalloon(sprite) {
    sprite.anchor.set(0.5);
    sprite.y = -35;
    this.addChild(sprite);

    sprite.currentLifetime = 0;
    sprite.lifetime = 10000;

    this.addedGravity = -0.00015;
  }

  gainFire(sprite) {
    sprite.anchor.set(0.5);
    sprite.y = -3;
    sprite.width = 40;
    sprite.alpha = 0.7;
    sprite.animationSpeed = 0.1;
    sprite.play();
    this.addChild(sprite);

    sprite.currentLifetime = 0;
    sprite.lifetime = 6000;

    this.onFire = true;
  }

  updateCurrent(dt) {
    this.updatePosition(dt);

    for (let child of this.children) {
      child.currentLifetime += dt;
      if (child.currentLifetime >= child.lifetime) {
        this.removeChild(child);
        this.addedGravity = 0;
        this.onFire = false;
      }
    }
  }
}
