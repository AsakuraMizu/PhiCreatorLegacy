import { makeAutoObservable, reaction } from 'mobx';
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

    api.settings.get().then((value) => {
      this.update(value);
      ['volume.music', 'volume.fx', 'helper.ap', 'rate', 'bgAlpha'].forEach(
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
      (value) => {
        api.settings.set(path, value);
      }
    );
  }
}

const settings = new SettingsManager();

export default settings;
