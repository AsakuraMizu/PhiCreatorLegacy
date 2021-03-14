import { makeObservable, observable, runInAction, toJS } from 'mobx';
import type { ChartData } from '/@/common';

class ChartManager {
  data?: ChartData = undefined;

  constructor() {
    makeObservable(this, {
      data: observable.deep,
    });
  }

  async load() {
    const data: ChartData = await api.readJSON('chart.json', {
      musicOffset: 0,
      timingBase: 48,
      bpmList: [{ id: 0, time: 0, bpm: 100 }],
      judgeLineList: [],
    });
    runInAction(() => {
      this.data = data;
    });
  }

  async save() {
    await api.outputJSON('chart.json', toJS(this.data));
  }
}

const chart = new ChartManager();

export default chart;
