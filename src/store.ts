import { App, reactive } from 'vue';
import type { ChartData } from './player/ChartData';
import chart from './chart.json';

const store = {
  state: reactive({
    chart: <ChartData>chart,
    offset: 0,
  }),

  setChart(newChart: ChartData) {
    this.state.chart = newChart;
  },

  setOffset(newOffset: number) {
    this.state.offset = newOffset;
  },
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: typeof store;
  }
}

export default function install(app: App): void {
  app.config.globalProperties.$store = store;
}
