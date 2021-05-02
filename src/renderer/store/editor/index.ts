import { types, Instance } from 'mobx-state-tree';
import { union } from 'lodash-es';
import { props } from '../../common';
import Timing from './timing';
import Track from './track';
import SingleJudgeLine from '../chart/judgeline';

const Editor = types
  .model({
    line: types.safeReference(SingleJudgeLine),
    tab: types.optional(types.integer, 0),
    timing: types.optional(Timing, {}),
    track: types.optional(Track, {}),
  })
  .actions((self) => ({
    switchTab(tab: number) {
      self.tab = tab;
    },
    setCurrentLine(lineOrId: Instance<typeof SingleJudgeLine> | number) {
      self.line = (lineOrId as unknown) as Instance<typeof SingleJudgeLine>;
    },
  }))
  .views((self) => ({
    get allTimes() {
      return self.line
        ? union(...props.map((prop) => self.line!.props[prop].times))
        : [];
    },
  }));

export default Editor;
