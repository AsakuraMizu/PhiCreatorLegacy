import { makeAutoObservable } from 'mobx';
import { maxBy, remove } from 'lodash-es';
import { NoteData, Props, pround, State } from '/@/common';
import { chart, timing } from '/@/managers';
import editor from '../../state';

export type ToolType = 'cursor' | 'note' | 'prop';

export const props: Props[] = [
  'controlX',
  'controlY',
  'angle',
  'speed',
  'noteAlpha',
  'lineAlpha',
  'displayRange',
];

class TrackState {
  timeToY(time: number): number {
    return (
      this.rect.height -
      ((time - timing.tick) / (chart.data?.timingBase ?? 48)) *
        this.beatHeight -
      this.shiftHeight
    );
  }

  yToTime(y: number): number {
    return (
      ((this.rect.height - y - this.shiftHeight) / this.beatHeight) *
        (chart.data?.timingBase ?? 48) +
      timing.tick
    );
  }

  tool: ToolType = 'cursor';

  rect = new DOMRect(0, 0, 0, 0);
  clientX = 0;
  clientY = 0;
  update(clientX: number, clientY: number) {
    this.clientX = clientX;
    this.clientY = clientY;
  }

  get exactX(): number {
    return ((this.clientX - this.rect.left) / this.rect.width) * 2 - 1;
  }
  get x(): number {
    return this.align ? pround(this.exactX, 1 / this.guideline) : this.exactX;
  }
  get exactTime(): number {
    return this.yToTime(this.clientY - this.rect.top);
  }
  get time(): number {
    return pround(
      this.exactTime,
      (chart.data?.timingBase ?? 48) / this.division
    );
  }

  startClientX = 0;
  startClientY = 0;
  startExactX = 0;
  startX = 0;
  startExactTime = 0;
  startTime = 0;
  start() {
    this.startClientX = this.clientX;
    this.startClientY = this.clientY;
    this.startExactX = this.exactX;
    this.startX = this.x;
    this.startExactTime = this.exactTime;
    this.startTime = this.time;
  }

  get dist2(): number {
    return (
      (this.startClientX - this.clientX) ** 2 +
      (this.startClientY - this.clientY) ** 2
    );
  }

  left = true;
  ctrl = false;
  pressing = false;
  pressingNote = false;
  dragging = false;

  virtualNote: NoteData = {
    id: 0,
    type: 1,
    time: 0,
    holdTime: 0,
    x: 0,
    width: 1,
    speed: 1,
    side: 1,
    isFake: false,
  };

  get lineData() {
    return chart.data?.judgeLineList[editor.line];
  }

  get lastId(): number {
    return maxBy(this.lineData?.noteList, 'id')?.id ?? -1;
  }

  selected = new Set<number>();
  selecting = new Set<number>();
  unselecting = new Set<number>();
  selectOne(idx: number) {
    if (!this.ctrl) {
      this.selected.clear();
    }
    this.selected.add(idx);
  }
  deleteSelected() {
    const list = chart.data?.judgeLineList[editor.line].noteList;
    if (list) {
      remove(list, (_, index) => this.selected.has(index));
    }
    this.selected.clear();
    chart.patch();
  }

  get deltaX(): number {
    return this.align && this.selected.size !== 0
      ? Math.min(
          ...Array.from(this.selected).map((idx) => {
            if (this.lineData) {
              const newX = pround(
                this.lineData?.noteList[idx].x + this.exactX - this.startExactX,
                1 / this.guideline
              );
              return newX - this.lineData?.noteList[idx].x;
            }
            return 0;
          })
        )
      : this.exactX - this.startExactX;
  }
  get deltaTime(): number {
    return pround(
      this.exactTime - this.startExactTime,
      (chart.data?.timingBase ?? 48) / this.division
    );
  }

  get propData() {
    const map = new Map<number, Partial<Record<Props, State>>>();
    props.forEach((name) => {
      this.lineData?.props[name].forEach((state) => {
        if (map.has(state.time)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          map.get(state.time)![name] = state;
        } else {
          map.set(state.time, {
            [name]: state,
          });
        }
      });
    });
    return map;
  }

  division = 1;
  divisions = [1, 2, 3, 4, 6, 8, 16];
  setDivision(division: number) {
    if (this.divisions.includes(division)) this.division = division;
  }

  guideline = 10;
  align = true;

  shiftHeight = 200;

  zoom = 1;

  zoomin() {
    let f = this.zoom * 1.414;
    if (f > 3.9) f = 4;
    this.zoom = f;
  }

  zoomout() {
    let f = this.zoom / 1.414;
    if (f < 0.3) f = 0.25;
    this.zoom = f;
  }

  get beatHeight(): number {
    return 200 * this.zoom;
  }

  constructor() {
    makeAutoObservable(this);
  }

  clear() {
    this.selected.clear();
    this.pressing = this.pressingNote = false;
  }
}

const track = new TrackState();

export default track;
