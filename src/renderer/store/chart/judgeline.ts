import {
  types,
  getSnapshot,
  SnapshotOrInstance,
  Instance,
} from 'mobx-state-tree';
import AutoId from '../autoId';
import SingleNote from './note';
import PropList from './prop';

const SingleJudgeLineProps = types.model({
  controlX: types.optional(PropList, [{ time: 0, value: 0, easing: 0 }]),
  controlY: types.optional(PropList, [{ time: 0, value: 0, easing: 0 }]),
  angle: types.optional(PropList, [{ time: 0, value: 0, easing: 0 }]),
  speed: types.optional(PropList, [{ time: 0, value: 1, easing: 0 }]),
  noteAlpha: types.optional(PropList, [{ time: 0, value: 1, easing: 0 }]),
  lineAlpha: types.optional(PropList, [{ time: 0, value: 1, easing: 0 }]),
  displayRange: types.optional(PropList, [{ time: 0, value: -1, easing: 0 }]),
});

const SingleJudgeLineId = new AutoId();

const SingleJudgeLine = types
  .model('SingleJudgeLine', {
    id: types.optional(types.identifierNumber, () => SingleJudgeLineId.next()),
    name: types.optional(types.maybe(types.string), undefined),
    noteList: types.array(SingleNote),
    props: types.optional(SingleJudgeLineProps, {}),
  })
  .extend((self) => {
    SingleJudgeLineId.update(self.id);
    return {};
  })
  .actions((self) => ({
    update(data: { name?: string }) {
      Object.assign(self, data);
    },
    addNote(note: SnapshotOrInstance<typeof SingleNote>) {
      self.noteList.push(note);
    },
    removeNote(note: Instance<typeof SingleNote>) {
      self.noteList.remove(note);
    },
  }))
  .views((self) => ({
    clone() {
      return {
        noteList: self.noteList.map((note) => note.clone()),
        props: getSnapshot(self.props),
      };
    },
  }));

export default SingleJudgeLine;
