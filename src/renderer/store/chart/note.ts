import { getSnapshot, types } from 'mobx-state-tree';
import AutoId from '../autoId';

const SingleNoteId = new AutoId();

const SingleNote = types
  .model('SingleNote', {
    id: types.optional(types.identifierNumber, () => SingleNoteId.next()),
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
  .extend((self) => {
    SingleNoteId.update(self.id);
    return {};
  })
  .volatile(() => ({
    hl: false,
  }))
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
    mark(hl: boolean) {
      self.hl = hl;
    },
  }))
  .views((self) => ({
    clone() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = getSnapshot(self);
      return rest;
    },
  }));

export default SingleNote;
