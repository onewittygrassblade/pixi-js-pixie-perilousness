// Return true if there is an overlap between two rectangles
export default function hitTestRectangle(r1, r2, global = false) {
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  if (global) {
    r1.centerX = r1.getGlobalPosition().x + r1.halfWidth;
    r1.centerY = r1.getGlobalPosition().y + r1.halfHeight;
    r2.centerX = r2.getGlobalPosition().x + r2.halfWidth;
    r2.centerY = r2.getGlobalPosition().y + r2.halfHeight;
  }
  else {
    r1.centerX = r1.x + r1.halfWidth;
    r1.centerY = r1.y + r1.halfHeight;
    r2.centerX = r2.x + r2.halfWidth;
    r2.centerY = r2.y + r2.halfHeight;
  }

  if (Math.abs(r1.centerX - r2.centerX) < r1.halfWidth + r2.halfWidth
  && Math.abs(r1.centerY - r2.centerY) < r1.halfHeight + r2.halfHeight) {
    return true;
  }

  return false;
}
