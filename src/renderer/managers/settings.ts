import { onSnapshot } from 'mobx-state-tree';
import store from '../store';

export const fileName = 'settings';

class SettingsManager {
  constructor() {
    api.storage.get(fileName, (error, value) => {
      if (error) throw error;
      store.settings.update(value);
    });

    onSnapshot(store.settings, (sn) => {
      api.storage.set(fileName, sn, (error) => {
        if (error) throw error;
      });
    });
  }
}

const settings = new SettingsManager();

export default settings;
