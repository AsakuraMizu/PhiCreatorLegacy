import { makeAutoObservable } from 'mobx';
import { maxBy } from 'lodash-es';
import { chart } from '/@/managers';
import { Tabs } from './tabs';

class EditorState {
  tab: Tabs = 0;

  /**
   * Current selected judge-line
   */
  line = 0;

  get lastId(): number {
    return maxBy(chart.data?.judgeLineList, 'id')?.id ?? -1;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const editor = new EditorState();

export default editor;
