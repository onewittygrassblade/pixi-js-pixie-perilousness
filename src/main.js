import App from './App.js';

App.loadImages()
  .then(App.loadFonts)
  .then(App.loadSounds)
  .then(() => {
    new App().setup();
  });
