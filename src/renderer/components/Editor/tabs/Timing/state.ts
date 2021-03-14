import { makeAutoObservable } from 'mobx';
import { maxBy } from 'lodash-es';
import { chart } from '/@/managers';

class TimingState {
  selected = 0;

  get lastId() {
    return maxBy(chart.data?.bpmList, 'id')?.id ?? -1;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const timing_ = new TimingState();

export default timing_;
