// Return a set containing collision labels between a sprite and a container
export default function contain(sprite, container) {
  let collision = new Set();

  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision.add("left");
  }

  if (sprite.x + sprite.width > container.x + container.width) {
    sprite.x = container.x + container.width - sprite.width;
    collision.add("right");
  }

  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision.add("top");
  }

  if (sprite.y + sprite.height > container.y + container.height) {
    sprite.y = container.y + container.height - sprite.height;
    collision.add("bottom");
  }

  if (collision.size === 0) {
    collision = undefined;
  }

  return collision;
}
