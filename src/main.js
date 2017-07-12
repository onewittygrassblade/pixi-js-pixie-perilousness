import App from './App.js';

App.loadImages().then(() => {
  new App().setup();
});
