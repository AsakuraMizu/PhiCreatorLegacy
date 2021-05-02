import { types, Instance } from 'mobx-state-tree';
import SingleBpm from '../chart/bpm';

const Timing = types
  .model({
    selectedBpm: types.safeReference(SingleBpm),
    time: 0,
    bpm: 100,
  })
  .actions((self) => ({
    setSelectedBpm(bpm: Instance<typeof SingleBpm>) {
      self.selectedBpm = bpm;
    },
    updateCurrent(data: { time?: number; bpm?: number }) {
      Object.assign(self, data);
    },
    applyCurrent() {
      if (self.selectedBpm) {
        self.selectedBpm.update({ time: self.time, bpm: self.bpm });
      }
    },
  }));

export default Timing;
