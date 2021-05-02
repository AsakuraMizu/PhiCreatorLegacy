import { makeAutoObservable } from 'mobx';
import { file2url } from '/@/common';
import store from '../store';

class BackgroundManager {
  loaded = false;
  src = '';

  constructor() {
    makeAutoObservable(this);
  }

  async load() {
    if (!(await api.pathExists(store.meta.background))) return;
    const src = await file2url(store.meta.background);
    this.update(src);
  }

  update(src: string) {
    this.loaded = true;
    this.src = src;
  }
}

const background = new BackgroundManager();

export default background;
