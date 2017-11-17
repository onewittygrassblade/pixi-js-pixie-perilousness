import App from './App.js';

App.loadImages()
  .then(App.loadFont)
  .then(App.loadSounds)
  .then(() => {
    new App().setup();
  });
