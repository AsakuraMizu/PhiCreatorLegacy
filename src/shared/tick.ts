import type { TimingData } from './chart-data';

export function calcTick(timing: TimingData, time: number): number {
  const bpmList = [...timing.bpmList];
  let bpm = bpmList[0].bpm;
  let tick = 0;
  let cur = 0, delta = 0;
  bpmList.shift();
  while (bpmList.length > 0 && cur <= time) {
    delta = Math.min(time - cur, (bpmList[0].time - tick) / bpm / 1.2);
    cur += delta;
    tick += delta * bpm * 1.2;
    bpm = bpmList[0].bpm;
    bpmList.shift();
  }
  tick += (time - cur) * bpm * 1.2;
  return tick;
}

export function calcTime(timing: TimingData, tick: number): number {
  const bpmList = [...timing.bpmList];
  let bpm = bpmList[0].bpm;
  let time = 0;
  let cur = 0, delta = 0;
  bpmList.shift();
  while (bpmList.length > 0 && cur <= tick) {
    delta = Math.min(tick - cur, bpmList[0].time - cur);
    cur += delta;
    time += delta / bpm / 1.2;
    bpm = bpmList[0].bpm;
    bpmList.shift();
  }
  time += (tick - cur) / bpm / 1.2;
  return time;
}
