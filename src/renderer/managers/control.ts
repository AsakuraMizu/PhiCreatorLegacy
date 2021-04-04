import { action, makeAutoObservable } from 'mobx';
import music from './music';

class ControlManager {
  live = true;
  full = false;

  handle?: number;
  delay = 0;
  lastProgress = 0;

  constructor() {
    makeAutoObservable(this);
  }

  toggleLive() {
    this.live = !this.live;
  }

  toggleFull() {
    this.full = !this.full;
    clearInterval(this.handle);
    this.handle = undefined;
    if (music.playing) music.toggle();
    if (this.full) {
      this.lastProgress = music.progress;
      music.seek(0);
      this.delay = 2500;
      this.handle = window.setInterval(
        action(() => {
          this.delay -= 20;
          if (this.delay <= 0) {
            music.toggle();
            clearInterval(this.handle);
            this.handle = undefined;
          }
        }),
        20
      );
    } else {
      music.seek(this.lastProgress);
    }
  }
}

const control = new ControlManager();

export default control;
