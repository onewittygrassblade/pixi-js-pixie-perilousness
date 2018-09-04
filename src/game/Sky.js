import {
  Container,
  TilingSprite,
  filters,
  Graphics
} from '../const/aliases';

import SpatialEmitter from '../particle/SpatialEmitter';

export default class Sky {
  constructor(textures, width, height) {
    this.container = new Container();

    this.sprite = new TilingSprite(textures['clouds.png'], width, height);
    this.container.addChild(this.sprite);

    this.colorMatrix = new filters.ColorMatrixFilter();
    this.colorMatrix.saturate(-0.5, false);

    const whiteCircle = new Graphics();
    whiteCircle.beginFill(0xFFFFFF);
    whiteCircle.drawCircle(0, 0, 18);
    whiteCircle.endFill();

    /* eslint-disable no-multi-spaces */
    this.emitter = new SpatialEmitter(
      [whiteCircle.generateCanvasTexture()],
      4,            // minSize
      10,           // maxSize
      0, width,     // minX, maxX
      0, 0,         // minY, maxY
      0.15,         // minInitialSpeed
      0.25,         // maxInitialSpeed
      0,            // minGravity
      0,            // maxGravity
      0,            // minRotationVelocity
      0,            // maxRotationVelocity
      0,            // minShrinkVelocity
      0,            // maxShrinkVelocity
      10000,        // minLifetime
      10000,        // maxLifetime
      4.2,          // minDirectionAngle
      4.2,          // maxDirectionAngle
      false,        // randomSpacing
      false,        // emitting
      9,            // emissionRate
      1,            // numberOfParticlesPerEmit
    );
    /* eslint-enable no-multi-spaces */
    this.container.addChild(this.emitter.particleSystem.container);
  }

  winterize() {
    this.sprite.filters = [this.colorMatrix];
    this.emitter.emit();
  }

  summerize() {
    this.sprite.filters = [];
    this.emitter.stop();
  }

  updateCurrent(scrollSpeed, dt) {
    this.sprite.tilePosition.x -= scrollSpeed * dt;
    this.emitter.update(dt);
  }
}
