import { makeAutoObservable } from 'mobx';
import { getIndex } from '../common';

export interface SingleStateSerialize {
  time: number;
  value: number;
  easing: number | null;
}

export class SingleState {
  time = 0;
  value = 0;
  easing = null;

  update(data: Partial<SingleStateSerialize>): void {
    Object.assign(this, data);
  }

  serialize(): SingleStateSerialize {
    const { time, value, easing } = this;
    return { time, value, easing };
  }

  constructor(public $line: number, public $id: number) {
    makeAutoObservable(this);
  }
}

export class NormalPropManager {
  states: SingleState[] = [];

  nextId = 0;

  getIndex($id: number): number {
    return getIndex(this.states, $id, (t, e) => t < e.$id);
  }

  get($id: number): SingleState | null {
    const i = this.getIndex($id);
    if ($id === this.states[i].$id) {
      return this.states[i];
    } else {
      return null;
    }
  }

  add(): SingleState {
    const state = new SingleState(this.$line, this.nextId++);
    this.states.push(state);
    return state;
  }

  remove($id: number): void {
    const i = this.getIndex($id);
    if ($id === this.states[i].$id) this.states.splice(i, 1);
  }

  constructor(public $line: number, public $default: number) {
    makeAutoObservable(this, {
      nextId: false,
      getIndex: false,
      get: false,
    });
  }
}
