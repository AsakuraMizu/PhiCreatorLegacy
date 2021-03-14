import {
  makeAutoObservable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
} from 'mobx';
import { Howl } from 'howler';
import { file2url } from '/@/common';
import meta from './meta';
import settings from './settings';

class MusicManager {
  music?: Howl;
  playing = false;
  loaded = false;
  duration = 1;
  progress = 0;
  private interval?: number;

  constructor() {
    makeAutoObservable(this, {
      music: false,
      load: false,
    });
    onBecomeObserved(this, 'progress', () => {
      this.interval = window.setInterval(() => this.updateProgress(), 10);
    });
    onBecomeUnobserved(this, 'progress', () => {
      clearInterval(this.interval);
    });
    reaction(
      () => settings.rate,
      (rate) => {
        this.music?.rate(rate);
      },
      {
        fireImmediately: true,
      }
    );
    reaction(
      () => settings.volume.music,
      (volume) => {
        this.music?.volume(volume);
      },
      {
        fireImmediately: true,
      }
    );
  }

  async load() {
    if (!(await api.pathExists(meta.music))) return;
    this.playing && this.toggle();
    const { progress } = this;
    this.music = new Howl({
      src: await file2url(meta.music),
      format: [api.extname(meta.music).split('.')[1]],
      rate: settings.rate,
      volume: settings.volume.music,
      onload: () => {
        this.onload();
        this.seek(progress);
      },
      onend: () => this.toggle(),
    });
  }

  onload() {
    this.duration = this.music?.duration() ?? 1;
    this.playing = false;
    this.loaded = true;
  }

  updateProgress() {
    this.progress = ((this.music?.seek() ?? 0) as number) / this.duration;
  }

  seek(progress: number) {
    this.music?.seek(Math.max(0, Math.min(1, progress)) * this.duration);
  }

  toggle() {
    if (this.playing) {
      this.music?.pause();
      this.playing = false;
    } else {
      this.music?.play();
      this.playing = true;
    }
  }
}

const music = new MusicManager();

export default music;
