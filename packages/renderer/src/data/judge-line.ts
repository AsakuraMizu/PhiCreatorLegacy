import { makeAutoObservable } from 'mobx';
import { getIndex } from '../common';
import { NoteManager } from './note';
import type { NoteInstance } from './note';

export class JudgeLineInstance {
  // data
  name = 'Line';

  nm: NoteManager;

  addNote(): NoteInstance {
    const note = this.nm.add();
    return note;
  }

  removeNote($id: number): void {
    this.nm.remove($id);
  }

  constructor(public $id: number) {
    this.nm = new NoteManager($id);
    makeAutoObservable(this);
  }
}

export class JudgeLineManager {
  pool: JudgeLineInstance[] = [];

  nextId = 0;

  getIndex($id: number): number {
    return getIndex(this.pool, $id, (t, e) => t < e.$id);
  }

  get($id: number): JudgeLineInstance | null {
    const i = this.getIndex($id);
    if ($id === this.pool[i].$id) {
      return this.pool[i];
    } else {
      return null;
    }
  }

  add(): JudgeLineInstance {
    const instance = new JudgeLineInstance(this.nextId++);
    this.pool.push(instance);
    return instance;
  }

  remove($id: number): void {
    const i = this.getIndex($id);
    if ($id === this.pool[i].$id) this.pool.splice(i, 1);
  }

  clone($id: number): JudgeLineInstance | null {
    const source = this.get($id);
    if (!source) return null;

    const instance = this.add();

    source.nm.pool.forEach((n) => {
      instance.addNote().update(n.serialize());
    });

    return instance;
  }

  constructor() {
    makeAutoObservable(this, {
      nextId: false,
      getIndex: false,
      get: false,
    });
  }
}

export const jlm = new JudgeLineManager();
