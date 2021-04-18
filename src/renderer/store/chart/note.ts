import { types } from 'mobx-state-tree';
import incId from '../incId';

const SingleNote = types
  .model('SingleNote', {
    $id: types.optional(types.identifierNumber, incId()),
    type: types.union(
      types.literal(1),
      types.literal(2),
      types.literal(3),
      types.literal(4)
    ),
    time: types.integer,
    holdTime: types.integer,
    x: types.number,
    width: types.number,
    speed: types.number,
    side: types.union(types.literal(-1), types.literal(1)),
    isFake: types.boolean,
  })
  .actions((self) => ({
    update(data: {
      type?: 1 | 2 | 3 | 4;
      time?: number;
      holdTime?: number;
      x?: number;
      width?: number;
      speed?: number;
      side?: 1 | -1;
      isFake?: boolean;
    }) {
      Object.assign(self, data);
    },
  }));

export default SingleNote;
