import { local } from './utils';
import type { ChartData } from '../shared/chart-data';

function migrate(chart: ChartData): ChartData {
  // Migrate from scratch
  (chart as unknown) = chart ?? {};
  (chart.timing as unknown) = chart.timing ?? {};
  chart.timing.offset = chart.timing.offset ?? 0;
  chart.timing.bpmList = chart.timing.bpmList ?? [];
  chart.timing.bpmList[0] = chart.timing.bpmList[0] ?? {
    id: 0,
    time: 0,
    bpm: 150,
  };
  chart.judgeLineList = chart.judgeLineList ?? [];
  for (const line of chart.judgeLineList) {
    for (const note of line.noteList) {
      // Migrate from 0.0.0/0.0.1
      if ((note as unknown as {showTime: unknown}).showTime) {
        delete (note as unknown as {showTime: unknown}).showTime;
      }
    }
  }
  return chart;
}

export default local('chart', <ChartData>undefined, migrate);
