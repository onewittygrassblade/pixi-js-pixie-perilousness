import { AnimatedSprite } from './const/aliases.js';

export default class Entity extends AnimatedSprite {
  constructor(
    textureFrames,
    x = 0,
    y = 0,
    vx = 0,
    vy = 0,
    ax = 0,
    ay = 0,
    rotation = 0,
    rotationVelocity = 0,
    rotationAcceleration = 0) {

    super(textureFrames);

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;

    this.anchor.set(0.5, 0.5);
    this.rotation = rotation;
    this.rotationVelocity = rotationVelocity;
    this.rotationAcceleration = rotationAcceleration;
  }

  updatePosition(dt) {
    this.vx += this.ax * dt;
    this.x += this.vx * dt;

    this.vy += this.ay * dt;
    this.y += this.vy * dt;
  }

  updateRotation(dt) {
    this.rotationVelocity += this.rotationAcceleration * dt;
    this.rotation += this.rotationVelocity * dt;
  }
}
