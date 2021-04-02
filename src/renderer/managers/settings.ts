import { makeAutoObservable, reaction, toJS } from 'mobx';
import { get, merge } from 'lodash-es';
import { RPartial } from '/@/common';

interface ISettings {
  volume: {
    music: number;
    fx: number;
  };
  rate: number;
  dim: number;
}

class SettingsManager implements ISettings {
  volume = {
    music: 1.0,
    fx: 1.0,
  };
  rate = 1.0;
  dim = 0.3;

  constructor() {
    makeAutoObservable(this, {
      watch: false,
    });

    api.storage.get('settings', (error, value) => {
      if (error) throw error;
      this.update(value);
      ['volume.music', 'volume.fx', 'helper.ap', 'rate', 'dim'].forEach(
        (path) => {
          this.watch(path);
        }
      );
    });
  }

  update(value: RPartial<ISettings>) {
    merge(this, value);
  }

  watch(path: string) {
    reaction(
      () => get(this, path),
      () => {
        api.storage.set('settings', toJS(this), (error) => {
          if (error) throw error;
        });
      }
    );
  }
}

const settings = new SettingsManager();

export default settings;
