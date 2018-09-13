export default [
  {
    hint: 'Hello Pixie!',
    world: {
      sliding: false,
      night: false,
      winter: false,
    },
  },
  {
    hint: 'Sliding pillars!',
    world: {
      sliding: true,
      night: false,
      winter: false,
    },
  },
  {
    hint: 'Night time',
    world: {
      sliding: false,
      night: true,
      winter: false,
    },
  },
  {
    hint: 'Winter!',
    world: {
      sliding: false,
      night: false,
      winter: true,
    },
  },
];
