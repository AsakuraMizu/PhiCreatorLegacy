import { merge } from 'lodash-es';
import { makeAutoObservable } from 'mobx';
import { RPartial } from '/@/common';

interface IMeta {
  title: string;
  difficulty: string;
  artist: string;
  illustrator: string;
  charter: string;
  music: string;
  background: string;
}

class MetaManager implements IMeta {
  title = '';
  difficulty = '';
  artist = '';
  illustrator = '';
  charter = '';
  music = '';
  background = '';

  constructor() {
    makeAutoObservable(this);
  }

  update(meta: RPartial<IMeta>) {
    merge(this, meta);
  }

  async load() {
    const meta: RPartial<IMeta> = await api.project.readJSON('meta.json', {
      title: '',
      difficulty: '',
      artist: '',
      illustrator: '',
      charter: '',
      music: '',
      background: '',
    });
    this.update(meta);
  }

  async save() {
    await api.project.outputJSON('meta.json', this);
  }
}

const meta = new MetaManager();

export default meta;
