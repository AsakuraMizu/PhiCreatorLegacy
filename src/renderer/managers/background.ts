import { makeAutoObservable, runInAction } from 'mobx';
import { Texture } from 'pixi.js';
import { file2url } from '/@/common';
import meta from './meta';

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
    if (!(await api.project.pathExists(meta.background))) return;
    const src = await file2url(meta.background);
    this.texture = await Texture.fromURL(src);
    runInAction(() => {
      this.src = src;
      this.dirty += 1;
    });
  }
}

const background = new BackgroundManager();

export default background;
