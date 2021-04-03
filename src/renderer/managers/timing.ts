import { makeAutoObservable, reaction } from 'mobx';
import { BpmData } from '/@/common';
import chart from './chart';
import music from './music';

class TimingManager {
  tick = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => ({
        bpmList: chart.data?.bpmList ?? [
          {
            id: -1,
            time: 0,
            bpm: 1,
          },
        ],
        time: music.progress * music.duration - (chart.data?.musicOffset || 0),
      }),
      ({ bpmList, time }, prev) => {
        let { tick } = this;
        let cur = prev?.time ?? 0;
        const bpmBefore: BpmData[] = bpmList.filter(
          (b) => b.time - tick <= 1e-5
        );
        if (bpmBefore.length === 0)
          bpmBefore.push({
            id: 0,
            time: 0,
            bpm: 1,
          });
        const bpmAfter: BpmData[] =
          chart.data?.bpmList.filter((b) => b.time - tick > 1e-5) ?? [];
        const factor = (chart.data?.timingBase ?? 48) / 60;
        let delta = 0;
        let { bpm } = bpmBefore[bpmBefore.length - 1];
        if (time < cur) {
          while (bpmBefore.length > 1 && cur >= time) {
            delta = Math.min(
              cur - time,
              (tick - bpmBefore[bpmBefore.length - 1].time) / bpm / factor
            );
            cur -= delta;
            tick -= delta * bpm * factor;
            if (time < bpmBefore[bpmBefore.length - 1].time) {
              bpmAfter.unshift(bpmBefore[bpmBefore.length - 1]);
              bpmBefore.pop();
              bpm = bpmBefore[bpmBefore.length - 1].bpm;
            }
          }
          tick -= (cur - time) * bpm * factor;
        } else {
          while (bpmAfter.length > 0 && cur <= time) {
            delta = Math.min(
              time - cur,
              (bpmAfter[0].time - tick) / bpm / factor
            );
            cur += delta;
            tick += delta * bpm * factor;
            if (time >= bpmAfter[0].time) {
              bpm = bpmAfter[0].bpm;
              bpmBefore.push(bpmAfter[0]);
              bpmAfter.shift();
            }
          }
          tick += (time - cur) * bpm * factor;
        }
        this.update(tick);
      },
      {
        fireImmediately: true,
      }
    );
  }

  private update(tick: number) {
    this.tick = tick;
  }
}

const timing = new TimingManager();

export default timing;
