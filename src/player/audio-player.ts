import howler from 'howler';
import Howl = howler.Howl;
import type { Fx } from './skin';
import type { NoteData } from '../shared/chart-data';

export type AudioType = 'music' | 'fx';

export type VolumeOptions = {
  [K in AudioType]?: number;
}

export default class AudioPlayer {
  tap: Howl;
  flick: Howl;
  drag: Howl;
  music?: Howl;

  musicId?: number;

  rate: number;
  musicVolume: number;
  fxVolume: number;

  constructor(fx: Fx, rate: number, volume: VolumeOptions) {
    this.rate = rate ?? 1;
    this.musicVolume = volume.music ?? 1;
    this.fxVolume = volume.fx ?? 1;
    for (const name in fx) {
      this[name] = this.load(fx[name]);
    }
  }

  init(url: string, time: number): void {
    if (url) {
      this.music = this.load(url);
      const id = this.music.play();
      this.music.stop(id);
      this.music.rate(this.rate, id);
      this.music.volume(this.musicVolume, id);
      this.music.seek(time, id);
      this.musicId = id;
    }
  }

  pause(paused: boolean): void {
    if (paused) {
      this.music?.pause(this.musicId);
    } else {
      this.music?.play(this.musicId);
    }
  }

  destroy(): void {
    this.music?.stop();
  }

  judge(type: NoteData['type']): void {
    let howl: Howl;
    switch (type) {
      case 'click': case 'hold': howl = this.tap; break;
      case 'flick': howl = this.flick; break;
      case 'drag': howl = this.drag; break;
    }
    const id = howl.play();
    howl.rate(this.rate, id);
    howl.volume(this.fxVolume, id);
  }

  get progress(): number {
    return this.music ? this.music.seek() as number / this.music.duration() : 0;
  }

  private load(url: string): Howl {
    return new Howl({
      src: url,
    });
  }
}
