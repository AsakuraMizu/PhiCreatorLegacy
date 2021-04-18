import { makeAutoObservable, runInAction } from 'mobx';
import { Texture } from 'pixi.js';
import { file2url } from '/@/common';
import store from '../store';

class BackgroundManager {
  src?: string;
  texture?: Texture;
  dirty = 0;

  constructor() {
    makeAutoObservable(this, {
      texture: false,
    });
  }

  async load() {
    if (!(await api.pathExists(store.meta.background))) return;
    const src = await file2url(store.meta.background);
    this.texture = await Texture.fromURL(src);
    runInAction(() => {
      this.src = src;
      this.dirty += 1;
    });
  }
}

const background = new BackgroundManager();

export default background;
