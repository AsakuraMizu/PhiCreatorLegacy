import { types } from 'mobx-state-tree';
import { getStoreEnv } from './env';

const Preview = types
  .model({
    width: 1200,
    height: 900,
    comboTotal: 4,
    combo: 0,
  })
  .views((self) => ({
    x(x: number) {
      return ((x + 1) * self.width) / 2;
    },
    y(y: number) {
      return ((1 - y) * self.height) / 2;
    },
    get score() {
      return Math.round((1e6 / self.comboTotal) * self.combo);
    },
  }))
  .actions((self) => ({
    updateSize(width: number, height: number) {
      self.width = width;
      self.height = height;
    },
    init() {
      const times = new Map<number, number>();
      getStoreEnv(self)
        .getChart()
        .judgeLineList.forEach((l) =>
          l.noteList.forEach((n) => {
            const x = times.get(n.time);
            if (x) times.set(n.time, x + 1);
            else times.set(n.time, 1);
          })
        );
      getStoreEnv(self)
        .getChart()
        .judgeLineList.forEach((l) =>
          l.noteList.forEach((n) => n.mark(times.get(n.time)! > 1))
        );

      let cnt = 0;
      getStoreEnv(self)
        .getChart()
        .judgeLineList.forEach((l) => {
          cnt += l.noteList.filter((n) => !n.isFake).length;
        });
      self.comboTotal = cnt;

      self.combo = 0;
    },
    incCombo() {
      self.combo += 1;
    },
    decCombo() {
      self.combo -= 1;
    },
  }));

export default Preview;