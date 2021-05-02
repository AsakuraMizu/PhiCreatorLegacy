import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { minBy } from 'lodash-es';
import { pround } from '/@/common';
import SingleNote from '../chart/note';
import { getStoreEnv } from '../env';

interface TrackUpdatable {
  rect?: DOMRect;
  clientX?: number;
  clientY?: number;
  pressingMode?:
    | 'none'
    | 'newNote'
    | 'noteStart'
    | 'drag'
    | 'select'
    | 'stretch';
  left?: boolean;
  ctrl?: boolean;
  align?: boolean;
  guideline?: number;
  editingProp?: boolean;
}

const Track = types
  .model({
    tool: types.optional(
      types.enumeration('ToolType', ['cursor', 'note', 'prop']),
      'cursor'
    ),
    rect: types.optional(
      types.custom<
        { x: number; y: number; width: number; height: number },
        DOMRect
      >({
        name: 'DOMRect',
        fromSnapshot({ x, y, width, height }) {
          return new DOMRect(x, y, width, height);
        },
        toSnapshot({ x, y, width, height }) {
          return {
            x,
            y,
            width,
            height,
          };
        },
        isTargetType(value) {
          return value instanceof DOMRect;
        },
        getValidationMessage() {
          return '';
        },
      }),
      new DOMRect(0, 0, 0, 0)
    ),
    clientX: 0,
    clientY: 0,
    startClientX: 0,
    startClientY: 0,
    startExactX: 0,
    startX: 0,
    startExactTime: 0,
    startTime: 0,
    left: true,
    ctrl: false,
    pressing: false,
    pressingMode: types.optional(
      types.enumeration([
        'none',
        'newNote',
        'noteStart',
        'drag',
        'select',
        'stretch',
      ]),
      'none'
    ),
    virtualNote: types.optional(SingleNote, {
      id: -1,
      type: 1,
      time: 0,
      holdTime: 0,
      x: 0,
      width: 1,
      speed: 1,
      side: 1,
      isFake: false,
    }),
    selected: types.array(
      types.safeReference(SingleNote, { acceptsUndefined: false })
    ),
    selecting: types.array(
      types.safeReference(SingleNote, { acceptsUndefined: false })
    ),
    unselecting: types.array(
      types.safeReference(SingleNote, { acceptsUndefined: false })
    ),
    division: 1,
    divisions: types.optional(types.array(types.integer), [
      1,
      2,
      3,
      4,
      6,
      8,
      12,
      16,
    ]),
    align: true,
    guideline: 10,
    shiftHeight: 150,
    zoom: 1,
    editingProp: false,
    clipboard: types.array(types.string),
  })
  .views((self) => ({
    get beatHeight() {
      return 200 * self.zoom;
    },
    timeToY(time: number) {
      return (
        self.rect.height -
        ((time - getStoreEnv(self).getTick()) /
          getStoreEnv(self).getChart().timingBase) *
          this.beatHeight -
        self.shiftHeight
      );
    },
    yToTime(y: number) {
      return (
        ((self.rect.height - y - self.shiftHeight) / this.beatHeight) *
          getStoreEnv(self).getChart().timingBase +
        getStoreEnv(self).getTick()
      );
    },
    xToScreenX(hsl: number) {
      return ((hsl + 1) / 2) * self.rect.width;
    },
  }))
  .views((self) => ({
    get exactX() {
      return ((self.clientX - self.rect.left) / self.rect.width) * 2 - 1;
    },
    get x() {
      return self.align ? pround(this.exactX, 1 / self.guideline) : this.exactX;
    },
    get exactTime() {
      return self.yToTime(self.clientY - self.rect.top);
    },
    get time() {
      return pround(
        this.exactTime,
        getStoreEnv(self).getChart().timingBase / self.division
      );
    },
    get dist2() {
      return (
        (self.startClientX - self.clientX) ** 2 +
        (self.startClientY - self.clientY) ** 2
      );
    },
    get deltaX() {
      return self.align && self.selected.length !== 0
        ? Math.min(
            ...self.selected.map((note) => {
              const newX = pround(
                note.x + this.exactX - self.startExactX,
                1 / self.guideline
              );
              return newX - note.x;
            })
          )
        : this.exactX - self.startExactX;
    },
    get deltaTime() {
      return pround(
        this.exactTime - self.startExactTime,
        getStoreEnv(self).getChart().timingBase / self.division
      );
    },
  }))
  .actions((self) => ({
    clear() {
      self.selected.clear();
      self.selecting.clear();
      self.unselecting.clear();
      self.pressing = false;
    },
  }))
  .actions((self) => ({
    update(data: TrackUpdatable) {
      Object.assign(self, data);
    },
    switchTool(tool: 'cursor' | 'note' | 'prop') {
      if (tool === self.tool) return;
      self.tool = tool;
      self.clear();
    },
    startPressing(
      pressingMode:
        | 'none'
        | 'newNote'
        | 'noteStart'
        | 'select'
        | 'stretch' = 'none'
    ) {
      self.startClientX = self.clientX;
      self.startClientY = self.clientY;
      self.startExactX = self.exactX;
      self.startX = self.x;
      self.startExactTime = self.exactTime;
      self.startTime = self.time;
      self.pressing = true;
      self.pressingMode = pressingMode;
    },
    stopPressing() {
      self.pressing = false;
      self.pressingMode = 'none';
    },
    addSelecting(note: Instance<typeof SingleNote>) {
      self.selecting.push(note);
    },
    delSelecting(note: Instance<typeof SingleNote>) {
      self.selecting.remove(note);
    },
    addUnselecting(note: Instance<typeof SingleNote>) {
      self.unselecting.push(note);
    },
    delUnselecting(note: Instance<typeof SingleNote>) {
      self.unselecting.remove(note);
    },
    applySelection() {
      self.selecting.forEach((note) => self.selected.push(note));
      self.selecting.clear();
      self.unselecting.forEach((note) => self.selected.remove(note));
      self.unselecting.clear();
    },
    clearSelected(force = false) {
      if (force || !self.ctrl) self.selected.clear();
    },
    selectOne(note: Instance<typeof SingleNote>) {
      this.clearSelected();
      self.selected.push(note);
    },
    deleteSelected() {
      const line = getStoreEnv(self).getEditor().line;
      const history = getStoreEnv(self).getChart().history;
      history.startGroup(() => 0);
      if (line) self.selected.forEach((note) => line.removeNote(note));
      history.stopGroup();
      self.clear();
    },
    setDivision(division: number) {
      if (self.divisions.includes(division)) self.division = division;
    },
    zoomin() {
      let f = self.zoom * 1.414;
      if (f > 3.9) f = 4;
      self.zoom = f;
    },
    zoomout() {
      let f = self.zoom / 1.414;
      if (f < 0.3) f = 0.25;
      self.zoom = f;
    },
    copy() {
      self.clipboard.clear();
      self.selected.forEach((note) =>
        self.clipboard.push(JSON.stringify(note.clone()))
      );
    },
    paste() {
      const { line } = getStoreEnv(self).getEditor();
      if (!line) return;
      const sns: SnapshotIn<typeof SingleNote>[] = self.clipboard.map((note) =>
        JSON.parse(note)
      );
      const lowest = minBy(sns, (sn) => sn.time)!.time;
      const history = getStoreEnv(self).getChart().history;
      history.startGroup(() => 0);
      sns.forEach((sn) =>
        line.addNote({ ...sn, time: sn.time - lowest + self.time })
      );
      history.stopGroup();
    },
    mirror() {
      const history = getStoreEnv(self).getChart().history;
      history.startGroup(() => 0);
      self.selected.forEach((note) => note.update({ x: -note.x }));
      history.stopGroup();
    },
  }));

export default Track;
