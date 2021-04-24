import { makeAutoObservable } from 'mobx';
import chart from './chart';
import music from './music';

interface Timepoint {
  tick: number;
  sec: number;
  bpm: number;
}

class TimingManager {
  get timepoints(): Timepoint[] {
    const timepoints: Timepoint[] = [];
    let curTick = 0;
    let curSec = 0;
    let curBpm = 0;
    chart.data?.bpmList.forEach((bpm) => {
      const deltaSec =
        (((bpm.time - curTick) / (chart.data?.timingBase ?? 48)) * 60) / curBpm;
      curTick = bpm.time;
      if (!Number.isNaN(deltaSec)) curSec += deltaSec;
      curBpm = bpm.bpm;
      timepoints.push({ tick: curTick, sec: curSec, bpm: curBpm });
    });
    return timepoints;
  }

  get tick() {
    const sec =
      music.progress * music.duration - (chart.data?.musicOffset ?? 0);
    const { timepoints: list } = this;
    let l = -1;
    let r = list.length;
    while (r - l > 1) {
      const m = Math.floor((l + r) / 2);
      if (sec - list[m].sec < 1e-5) {
        r = m;
      } else {
        l = m;
      }
    }
    if (l === -1) {
      return 0;
    }
    const tick =
      list[l].tick +
      ((sec - list[l].sec) / 60) * list[l].bpm * (chart.data?.timingBase ?? 48);
    return tick;
  }

  tickToTime(tick: number = this.tick) {
    let time = 0;
    let lastTimepoint = this.timepoints[0];
    for (let part = 1; part < this.timepoints.length; part++) {
      const timepoint = this.timepoints[part];
      if (tick > timepoint.tick) {
        time +=
          ((timepoint.tick - lastTimepoint.tick) /
            (chart.data?.timingBase ?? 48) /
            lastTimepoint.bpm) *
          60;
        lastTimepoint = timepoint;
      }
    }
    time +=
      ((tick - lastTimepoint.tick) /
        (chart.data?.timingBase ?? 48) /
        lastTimepoint.bpm) *
      60;
    return time;
  }

  constructor() {
    makeAutoObservable(this, {
      tickToTime: false,
    });
  }
}

const timing = new TimingManager();

export default timing;
