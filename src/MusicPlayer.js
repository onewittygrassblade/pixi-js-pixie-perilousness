export default class MusicPlayer {
  constructor(musics) {
    this.musics = musics;
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
    this.playing.play({ loop: true });
  }

  togglePause(paused) {
    if (paused) {
      this.playing.pause();
    } else {
      this.playing.resume();
    }
  }

  toggleMuted() {
    if (this.playing.isPlaying) {
      this.playing.muted = !this.playing.muted;
    }
  }

  isMuted() {
    return this.playing.muted;
  }
}
