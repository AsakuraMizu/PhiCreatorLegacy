import { makeAutoObservable } from 'mobx';
import dayjs from 'dayjs';
import background from './background';
import chart from './chart';
import meta from './meta';
import music from './music';
import settings from './settings';
import toast from './toast';

class ProjectManager {
  loaded = false;
  path = '';

  editorOpen = dayjs();
  lastSave?: dayjs.Dayjs;

  constructor() {
    makeAutoObservable(this);

    setInterval(() => {
      if (settings.autosave === 0) return;
      const now = dayjs();
      if (
        (this.lastSave &&
          now.diff(this.lastSave) > settings.autosave * 60000) ||
        (!this.lastSave &&
          now.diff(this.editorOpen) > settings.autosave * 60000)
      ) {
        this.save();
      }
    }, 30000);
  }

  mark(loaded: boolean) {
    this.loaded = loaded;
  }

  // Args are for making toast.
  async reload(reload = true, noToast = false) {
    this.mark(false);
    await meta.load();
    await chart.load();
    await music.load();
    await background.load();
    this.path = api.project.getProjectFolder();
    this.mark(true);
    if (!noToast)
      toast.send(`Project ${reload ? 're' : ''}loaded.`, { variant: 'info' });
  }

  async save() {
    if (!this.loaded) return;
    await meta.save();
    await chart.save();
    toast.send('Project saved.', { variant: 'success' });
    this.lastSave = dayjs();
  }
}

const project = new ProjectManager();

export default project;
