import App from './App.js';

App.loadImages()
  .then(App.loadFonts)
  .then(() => {
    new App().setup();
  });
