import { makeAutoObservable } from 'mobx';
import { getIndex } from '../common';

export interface NoteSerialize {
  type: 1 | 2 | 3 | 4;
  time: number;
  holdTime: number;
  x: number;
  width: number;
  speed: number;
  side: 1 | -1;
  isFake: boolean;
}

export class NoteInstance implements NoteSerialize {
  // data
  type: 1 | 2 | 3 | 4 = 1;
  time = 0;
  holdTime = 0;
  x = 0;
  width = 1;
  speed = 1;
  side: 1 | -1 = 1;
  isFake = false;

  update(data: Partial<NoteSerialize>): void {
    Object.assign(this, data);
  }

  serialize(): NoteSerialize {
    const { type, time, holdTime, x, width, speed, side, isFake } = this;
    return { type, time, holdTime, x, width, speed, side, isFake };
  }

  // internal
  hl = false;
  setHL(hl: boolean): void {
    this.hl = hl;
  }

  constructor(public $line: number, public $id: number) {
    makeAutoObservable(this, {
      serialize: false,
    });
  }
}

export class NoteManager {
  pool: NoteInstance[] = [];

  nextId = 0;

  getIndex($id: number): number {
    return getIndex(this.pool, $id, (t, e) => t < e.$id);
  }

  get($id: number): NoteInstance | null {
    const i = this.getIndex($id);
    if ($id === this.pool[i].$id) {
      return this.pool[i];
    } else {
      return null;
    }
  }

  add(): NoteInstance {
    const instance = new NoteInstance(this.$line, this.nextId++);
    this.pool.push(instance);
    return instance;
  }

  remove($id: number): void {
    const i = this.getIndex($id);
    if ($id === this.pool[i].$id) this.pool.splice(i, 1);
  }

  constructor(public $line: number) {
    makeAutoObservable(this, {
      nextId: false,
      getIndex: false,
      get: false,
    });
  }
}
