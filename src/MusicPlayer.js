export default class MusicPlayer {
  constructor(musics) {
    this.musics = musics;
    this.volume = 1;
  }

  play(theme) {
    if (this.playing) {
      if (this.playing !== this.musics[theme]) {
        this.playing.stop();
        this.startPlaying(theme);
      }
    } else {
      this.startPlaying(theme);
    }
  }

  startPlaying(theme) {
    this.playing = this.musics[theme];
    this.playing.volume = this.volume;
    this.playing.play({ loop: true });
  }

  togglePause(paused) {
    if (paused) {
      this.playing.pause();
    } else {
      this.playing.resume();
    }
  }

  setVolume(volume) {
    this.volume = volume;
  }

  mute() {
    this.volume = 0;
  }
}
