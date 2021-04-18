import { SnapshotIn, types } from 'mobx-state-tree';
import Chart from './chart';
import Meta from './meta';
import Settings from './settings';
import Preview from './preview';

import fallback from './chart/fallback.json';

const Store = types
  .model({
    meta: types.optional(Meta, {}),
    chart: types.optional(Chart, fallback),
    settings: types.optional(Settings, {}),
    preview: types.optional(Preview, {}),
  })
  .actions((self) => ({
    reloadChart(chart: SnapshotIn<typeof Chart>) {
      self.chart = Chart.create(chart);
    },
  }));

const store = Store.create({});

export default store;
