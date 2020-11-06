import { App, reactive } from 'vue';
import type { ChartData } from './player/ChartData';
import chart from './chart.json';

const store = {
  state: reactive({
    chart: <ChartData>chart,
  }),

  setChart(newChart: ChartData) {
    this.state.chart = newChart;
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
