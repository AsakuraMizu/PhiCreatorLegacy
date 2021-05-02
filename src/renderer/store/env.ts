import { getEnv, Instance, IStateTreeNode } from 'mobx-state-tree';
import Chart from './chart';
import Editor from './editor';
import { timing } from '../managers';
import store from '.';

export interface StoreEnv {
  getChart(): Instance<typeof Chart>;
  getEditor(): Instance<typeof Editor>;
  getTick(): number;
}

export const env: StoreEnv = {
  getChart: () => store.chart,
  getEditor: () => store.editor,
  getTick: () => timing.tick,
};

export function getStoreEnv(target: IStateTreeNode): StoreEnv {
  return getEnv(target);
}
