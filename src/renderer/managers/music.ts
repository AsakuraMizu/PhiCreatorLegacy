import {
  makeAutoObservable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
} from 'mobx';
import { Howl } from 'howler';
import { file2url } from '/@/common';
import store from '../store';

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
      () => store.settings.rate,
      (rate) => {
        this.music?.rate(rate);
      },
      {
        fireImmediately: true,
      }
    );
    reaction(
      () => store.settings.musicVolume,
      (volume) => {
        this.music?.volume(volume);
      },
      {
        fireImmediately: true,
      }
    );
  }

  async load() {
    if (!(await api.pathExists(store.meta.music))) return;
    this.playing && this.toggle();
    const { progress } = this;
    this.music = new Howl({
      src: await file2url(store.meta.music),
      format: [api.extname(store.meta.music).split('.')[1]],
      rate: store.settings.rate,
      volume: store.settings.musicVolume,
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
