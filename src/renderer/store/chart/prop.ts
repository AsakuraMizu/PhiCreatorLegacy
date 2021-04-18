import { types } from 'mobx-state-tree';
import Easing from './easing';
import { easeCalc } from '/@/common';

declare module 'mobx-state-tree/dist/types/complex-types/map' {
  export interface IMSTMap<
    IT extends import('mobx-state-tree/dist/internal').IAnyType
  > {
    get(key: number): IT['Type'] | undefined;
  }
}

const SingleProp = types
  .model('SingleProp', {
    time: types.integer,
    value: types.number,
    easing: Easing,
  })
  .actions((self) => ({
    update(data: { time?: number; value?: number; easing?: number }) {
      Object.assign(self, data);
    },
  }));

const PropList = types
  .model('PropList', {
    map: types.map(SingleProp),
  })
  .views((self) => ({
    get times() {
      return [...self.map.keys()].map(Number.parseInt).sort();
    },
  }))
  .views((self) => ({
    nth(n: number) {
      return self.map.get(self.times[n]);
    },
  }))
  .views((self) => ({
    current(time: number) {
      const { times } = self;
      let l = -1;
      let r = times.length;
      while (r - l > 1) {
        const m = Math.floor((l + r) / 2);
        if (time - times[m] < 1e-5) {
          r = m;
        } else {
          l = m;
        }
      }
      if (l === -1) {
        return self.nth(0)!.value;
      }
      if (l === self.times.length - 1) {
        return self.nth(l)!.value;
      }
      return easeCalc(
        self.nth(l)!.value,
        self.nth(l + 1)!.value,
        (time - self.nth(l)!.time) /
          (self.nth(l + 1)!.time - self.nth(l)!.time),
        self.nth(l)!.easing
      );
    },
  }));

export default types.snapshotProcessor(PropList, {
  preProcessor(data: { time: number; value: number; easing: number }[]) {
    return {
      map: Object.fromEntries(
        data.map(({ time, value, easing }) => [time, { time, value, easing }])
      ),
    };
  },
  postProcessor(
    sn
  ): { id: number; time: number; value: number; easing: number }[] {
    return Object.values(sn.map).map(({ time, value, easing }, index) => ({
      id: index,
      time,
      value,
      easing,
    }));
  },
});
