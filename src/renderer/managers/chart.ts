import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import store from '../store';
import { ChartData } from '../common';

class ChartManager {
  static fileName = 'chart.json';

  async load(): Promise<void> {
    const chart = await api.readJSON<ChartData>(ChartManager.fileName);
    if (chart) applySnapshot(store.chart, chart);
  }

  async save(): Promise<void> {
    await api.outputJSON(ChartManager.fileName, getSnapshot(store.chart));
  }
}

const chart = new ChartManager();

export default chart;
