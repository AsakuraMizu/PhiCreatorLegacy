import { types } from 'mobx-state-tree';
import incId from '../incId';
import SingleNote from './note';
import PropList from './prop';

const SingleJudgeLine = types
  .model('SingleJudgeLine', {
    $id: types.optional(types.identifierNumber, incId()),
    name: 'Line',
    noteList: types.array(SingleNote),
    controlX: PropList,
    controlY: PropList,
    angle: PropList,
    speed: PropList,
    noteAlpha: PropList,
    lineAlpha: PropList,
    displayRange: PropList,
  })
  .actions((self) => ({
    update(data: { name?: string }) {
      Object.assign(self, data);
    },
  }));

export default SingleJudgeLine;
