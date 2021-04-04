import { makeAutoObservable, observable, runInAction, toJS } from 'mobx';
import { cloneDeep, isEqual } from 'lodash';
import type { ChartData } from '/@/common';
import settings from '../settings';
// import { diffClone } from './helper';

class ChartManager {
  data?: ChartData = undefined;

  constructor() {
    makeAutoObservable(this, {
      data: observable.deep,
      source: observable.ref,
      undoPool: observable.shallow,
      redoPool: observable.shallow,
    });
  }

  async load() {
    const data: ChartData = await api.readJSON('chart.json', {
      schemaVersion: 1,
      musicOffset: 0,
      timingBase: 48,
      bpmList: [{ id: 0, time: 0, bpm: 100 }],
      judgeLineList: [
        {
          id: 0,
          noteList: [],
          props: {
            controlX: [{ id: 0, time: 0, value: 0 }],
            controlY: [{ id: 0, time: 0, value: 0 }],
            angle: [{ id: 0, time: 0, value: 0 }],
            speed: [{ id: 0, time: 0, value: 1 }],
            noteAlpha: [{ id: 0, time: 0, value: 1 }],
            lineAlpha: [{ id: 0, time: 0, value: 1 }],
            displayRange: [{ id: 0, time: 0, value: -1 }],
          },
        },
      ],
    });
    runInAction(() => {
      this.data = data;
      if (!this.source) {
        this.source = cloneDeep(data);
      } else {
        this.patch();
      }
    });
  }

  async save() {
    await api.outputJSON('chart.json', toJS(this.data));
  }

  source?: ChartData;
  undoPool: ChartData[] = [];
  redoPool: ChartData[] = [];

  get canUndo(): boolean {
    return settings.undo && this.undoPool.length > 0;
  }
  get canRedo(): boolean {
    return settings.undo && this.redoPool.length > 0;
  }

  async patch() {
    if (settings.undo && this.source && this.data) {
      if (isEqual(this.source, this.data)) return;
      this.redoPool = [];
      // const cur = diffClone(this.source, this.data);
      const cur = cloneDeep(this.data);
      this.undoPool.push(this.source);
      if (this.undoPool.length > 200) this.undoPool.shift();
      this.source = cur;
    }
  }

  undo() {
    if (!this.canUndo || !this.source) return;
    const data = this.undoPool.pop();
    if (!data) return;
    this.redoPool.push(this.source);
    this.source = data;
    this.data = cloneDeep(data);
  }

  redo() {
    if (!this.canRedo || !this.source) return;
    const data = this.redoPool.pop();
    if (!data) return;
    this.undoPool.push(this.source);
    this.source = data;
    this.data = cloneDeep(data);
  }
}

const chart = new ChartManager();

export default chart;
