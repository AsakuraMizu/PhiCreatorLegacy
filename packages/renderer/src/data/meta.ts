import { makeAutoObservable } from 'mobx';

export interface MetaSerialize {
  title: string;
  difficulty: string;
  artist: string;
  illustrator: string;
  charter: string;
  music: string;
  background: string;
}

export class MetaManager implements MetaSerialize {
  title = '';
  difficulty = '';
  artist = '';
  illustrator = '';
  charter = '';
  music = '';
  background = '';

  update(data: Partial<MetaSerialize>): void {
    Object.assign(this, data);
  }

  serialize(): MetaSerialize {
    const {
      title,
      difficulty,
      artist,
      illustrator,
      charter,
      music,
      background,
    } = this;
    return {
      title,
      difficulty,
      artist,
      illustrator,
      charter,
      music,
      background,
    };
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export const mm = new MetaManager();
