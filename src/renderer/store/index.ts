import { types } from 'mobx-state-tree';
import Chart from './chart';
import Meta from './meta';
import Settings from './settings';
import Editor from './editor';
import Preview from './preview';
import { env } from './env';

import chartFallback from './chart/fallback.json';

const Store = types.model({
  meta: types.optional(Meta, {}),
  chart: types.optional(Chart, chartFallback),
  settings: types.optional(Settings, {}),
  editor: types.optional(Editor, {}),
  preview: types.optional(Preview, {}),
});

const store = Store.create({}, env);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.store = store;

export default store;
