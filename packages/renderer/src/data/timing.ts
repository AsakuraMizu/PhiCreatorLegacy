import { makeAutoObservable } from 'mobx';
import { getIndex } from '../common';

export interface TpEntry {
  $id: number;
  time: number;
  bpm: number;
  sec: number;
}

export class TimingManager {
  offset = 0;
  base = 48;

  update(data: Partial<{ offset: number; base: number }>): void {
    Object.assign(this, data);
  }

  tps: TpEntry[] = [];

  nextId = 0;

  getIndex($id: number): number {
    return getIndex(this.tps, $id, (t, e) => t < e.$id);
  }

  get($id: number): TpEntry | null {
    const i = this.getIndex($id);
    if ($id === this.tps[i].$id) {
      return this.tps[i];
    } else {
      return null;
    }
  }

  private rebuild(start: number) {
    let time = 0;
    let bpm = 0;
    let sec = 0;
    if (start > 0) ({ time, bpm, sec } = this.tps[start - 1]);
    this.tps.slice(start).forEach((tp) => {
      const deltaSec = (((tp.time - time) / this.base) * 60) / bpm;
      time = tp.time;
      if (!Number.isNaN(deltaSec)) sec += deltaSec;
      bpm = tp.bpm;
      tp.sec = sec;
    });
  }

  addTp(time: number, bpm: number): TpEntry {
    const i = getIndex(this.tps, time, (t, e) => t < e.time);
    const $id = this.nextId++;
    this.tps.splice(i, 0, { $id, time, bpm, sec: 0 });
    this.rebuild(i + 1);
    return this.tps[i + 1];
  }

  removeTp($id: number): void {
    const i = this.getIndex($id);
    if ($id === this.tps[i].$id) this.tps.splice(i, 1);
    this.rebuild(i);
  }

  updateTp($id: number, time: number, bpm: number): TpEntry | null {
    const i = this.getIndex($id);
    if ($id !== this.tps[i].$id) return null;
    const ii = getIndex(this.tps, time, (t, e) => t < e.time);
    this.tps.splice(i, 1);
    this.tps.splice(ii, 0, { $id, time, bpm, sec: 0 });
    this.rebuild(Math.min(i, ii + 1));
    return this.tps[ii + 1];
  }

  sec2time(sec: number): number {
    sec -= this.offset;
    const i = getIndex(this.tps, sec, (t, e) => t < e.sec);
    if (i === -1) return 0;
    else
      return (
        this.tps[i].time +
        ((sec - this.tps[i].sec) / 60) * this.tps[i].bpm * this.base
      );
  }

  time2sec(time: number): number {
    const i = getIndex(this.tps, time, (t, e) => t < e.time);
    if (i === -1) return this.offset;
    else
      return (
        this.tps[i].sec +
        ((time - this.tps[i].time) / this.base / this.tps[i].bpm) * 60
      );
  }

  constructor() {
    makeAutoObservable(this, {
      nextId: false,
      getIndex: false,
      get: false,
      sec2time: false,
      time2sec: false,
    });
  }
}

export const tm = new TimingManager();
