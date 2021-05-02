import { Instance, SnapshotOrInstance, types } from 'mobx-state-tree';
import { UndoManager } from 'mst-middlewares';
import SingleBpm from './bpm';
import SingleJudgeLine from './judgeline';

const Chart = types
  .model('Chart', {
    schemaVersion: types.number,
    musicOffset: types.number,
    timingBase: types.number,
    bpmList: types.array(SingleBpm),
    judgeLineList: types.array(SingleJudgeLine),
  })
  .actions((self) => ({
    update(data: {
      schemaVersion?: number;
      musicOffset?: number;
      timingBase?: number;
    }) {
      Object.assign(self, data);
    },
    addJudgeLine(judgeLine: SnapshotOrInstance<typeof SingleJudgeLine>) {
      self.judgeLineList.push(judgeLine);
      return self.judgeLineList[self.judgeLineList.length - 1];
    },
    removeJudgeLine(judgeLine: Instance<typeof SingleJudgeLine>) {
      self.judgeLineList.remove(judgeLine);
    },
    addBpm(bpm: SnapshotOrInstance<typeof SingleBpm>) {
      self.bpmList.push(bpm);
      return self.bpmList[self.bpmList.length - 1].id;
    },
    removeBpm(bpm: Instance<typeof SingleBpm>) {
      self.bpmList.remove(bpm);
    },
  }))
  .volatile((self) => ({
    history: UndoManager.create({}, { targetStore: self }),
  }));

export default Chart;
