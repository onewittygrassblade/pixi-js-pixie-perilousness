import { AnimatedSprite } from '../const/aliases';

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
    rotationAcceleration = 0
  ) {
    super(textureFrames);

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.anchor.set(0.5, 0.5);
    this.anchorOffsetX = this.anchor.x * this.width;
    this.anchorOffsetY = this.anchor.y * this.height;

    this.rotation = rotation;
    this.rotationVelocity = rotationVelocity;
    this.rotationAcceleration = rotationAcceleration;

    this.nodeChildren = []; // workaround to have children without filters being applied to them
  }

  addNodeChild(nodeChild, offsetX, offsetY) {
    this.nodeChildren.push(nodeChild);
    nodeChild.offsetX = offsetX;
    nodeChild.offsetY = offsetY;
  }

  updatePosition(dt) {
    this.vx += this.ax * dt;
    this.x += this.vx * dt;

    this.vy += this.ay * dt;
    this.y += this.vy * dt;

    this.nodeChildren.forEach((nodeChild) => {
      nodeChild.x = this.x + nodeChild.offsetX;
      nodeChild.y = this.y + nodeChild.offsetY;
    });
  }

  updateRotation(dt) {
    this.rotationVelocity += this.rotationAcceleration * dt;
    this.rotation += this.rotationVelocity * dt;
  }
}
