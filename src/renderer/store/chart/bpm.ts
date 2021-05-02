import { types } from 'mobx-state-tree';
import AutoId from '../autoId';

const SingleBpmId = new AutoId();

const SingleBpm = types
  .model('SingleBpm', {
    id: types.optional(types.identifierNumber, () => SingleBpmId.next()),
    time: types.number,
    bpm: types.number,
  })
  .extend((self) => {
    SingleBpmId.update(self.id);
    return {};
  })
  .actions((self) => ({
    update(data: { time?: number; bpm?: number }) {
      Object.assign(self, data);
    },
  }));

export default SingleBpm;
