import { SnapshotOrInstance, types } from 'mobx-state-tree';
import { easeCalc } from '/@/common';

declare module 'mobx-state-tree/dist/types/complex-types/map' {
  export interface IMSTMap<
    IT extends import('mobx-state-tree/dist/internal').IAnyType
  > {
    delete(key: number): boolean;
    get(key: number): IT['Type'] | undefined;
    has(key: number): boolean;
    set(
      key: number,
      value: import('mobx-state-tree/dist/internal').ExtractCSTWithSTN<IT>
    ): this;
  }
}

const SingleProp = types
  .model('SingleProp', {
    time: types.integer,
    value: types.number,
    easing: types.integer,
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
  .actions((self) => ({
    add(data: SnapshotOrInstance<typeof SingleProp>) {
      self.map.set(data.time, data);
    },
    remove(time: number) {
      self.map.delete(time);
    },
  }))
  .views((self) => ({
    get times() {
      return [...self.map.keys()].map((x) => parseInt(x)).sort();
    },
    nth(n: number) {
      return self.map.get(this.times[n]);
    },
    current(time: number) {
      const { times } = this;
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
        return this.nth(0)!.value;
      }
      if (l === this.times.length - 1) {
        return this.nth(l)!.value;
      }
      return easeCalc(
        this.nth(l)!.value,
        this.nth(l + 1)!.value,
        (time - this.nth(l)!.time) /
          (this.nth(l + 1)!.time - this.nth(l)!.time),
        this.nth(l)!.easing
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
