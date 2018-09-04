import App from './App';

App.loadAssets()
  .then(() => {
    new App().setup();
  });
