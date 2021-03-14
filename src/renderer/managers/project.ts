import { makeAutoObservable } from 'mobx';
import background from './background';
import chart from './chart';
import meta from './meta';
import music from './music';

class ProjectManager {
  loaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  mark(loaded: boolean) {
    this.loaded = loaded;
  }

  async reload() {
    this.mark(false);
    await meta.load();
    await chart.load();
    await music.load();
    await background.load();
    this.mark(true);
  }

  async save() {
    await meta.save();
    await chart.save();
  }
}

const project = new ProjectManager();

export default project;
