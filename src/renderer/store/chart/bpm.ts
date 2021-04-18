import { types } from 'mobx-state-tree';
import incId from '../incId';

const SingleBpm = types
  .model('SingleBpm', {
    $id: types.optional(types.identifierNumber, incId()),
    time: types.number,
    bpm: types.number,
  })
  .actions((self) => ({
    update(data: { time?: number; bpm?: number }) {
      Object.assign(self, data);
    },
  }));

export default SingleBpm;
