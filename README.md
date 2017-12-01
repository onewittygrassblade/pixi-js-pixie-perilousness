# pixi-js-pixie-perilousness
This side scroller was inspired by the tutorial [Learn PixiJS](https://github.com/kittykatattack/learnPixiJS).

## Getting started

This project uses NPM and Webpack.

### Installing

Run the following commands in the directory where you wish to install the game:

```
git clone https://github.com/onewittygrassblade/pixi-js-pixie-perilousness.git
npm install
```

### Running

From the directory where you installed the game, run the following commands:

```
cd pixi-js-pixie-perilousness
npm start
```

Note the port on which the server is running (8080 by default):
```
Project is running at http://localhost:8080/
```

Open a browser (Chrome recommended) and go to your local server (e.g. http://localhost:8080/).

### Playing

* Keep Space pressed to make Pixie flap her wings.
* Avoid the green blocks!
* Collect presents if you can. Some of them contain teddy bears, which give you points; others contain surprises which will apply a temporary random effect!

## Main concepts

I have used this project to explore several patterns and concepts that are not part of the original tutorial.

### Fixed time step game loop

I recommend [this excellent step-by-step tutorial](http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing) for details.

### State stack

The various states of the app (title, game, pause...) are managed in a stack structure. At each time step, the stack updates the top state in the stack; if the latter returns true, the state underneath gets updated and so on. This allows great flexibility for multistate conditions such as pausing the game.

### Sound effects

Sound effects are managed using [pixi-sound](https://github.com/pixijs/pixi-sound).

### Additional in-game elements

* Pickup collection
* Score
* Levels
* Success/failure game over
