// Return a random integer between min and max included
export default function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
