import App from './App.js';

App.loadAssets()
  .then(() => {
    new App().setup();
  });
