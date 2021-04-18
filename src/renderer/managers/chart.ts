import { getSnapshot } from 'mobx-state-tree';
import store from '../store';
import { ChartData } from '../store/chart/format';

export const fileName = 'chart.json';

const chart = {
  async load(): Promise<void> {
    const chart = await api.readJSON<ChartData>(fileName);
    if (chart) store.reloadChart(chart);
  },
  async save(): Promise<void> {
    await api.outputJSON(fileName, getSnapshot(store.chart));
  },
};

export default chart;
