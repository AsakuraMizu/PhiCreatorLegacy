import {
  action,
  autorun,
  IReactionDisposer,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { Container, Graphics } from 'pixi.js';
import { Cull } from '@pixi-essentials/cull';
import hash from 'object-hash';
import type { State } from '/@/common/chart-data';
import { chart, timing } from '/@/managers';
import { easeCalc, easeSumCalc, search } from '/@/common';
import NoteRenderer from './note';
import { skin } from './resources';
import type Renderer from '.';

function updater(stateList: State[], tick: number) {
  const l = search(stateList, tick);
  if (l === -1) {
    return stateList[0].value;
  }
  if (l === stateList.length - 1) {
    return stateList[l].value;
  }
  return easeCalc(
    stateList[l].value,
    stateList[l + 1].value,
    (tick - stateList[l].time) / (stateList[l + 1].time - stateList[l].time),
    stateList[l].easing
  );
}

export default class JudgeLineRenderer {
  renderer: Renderer;

  i: number;
  container: Container;
  cull: Cull;
  line: Graphics;
  noteContainer: Container;
  displayRange = -1;
  notes = new Map<string, NoteRenderer>();

  disposers: IReactionDisposer[] = [];

  constructor(renderer: Renderer, i: number) {
    this.renderer = renderer;
    this.i = i;

    makeObservable(this, {
      renderer: observable,
      i: observable,
      notes: observable,
      assign: action,
      calcDist: action,
    });

    this.container = new Container();
    this.renderer.app.stage.addChild(this.container);

    this.line = new Graphics();
    this.line.lineStyle(4, skin.color);
    this.line.moveTo(-10000, 0);
    this.line.lineTo(10000, 0);
    this.container.addChild(this.line);

    this.noteContainer = new Container();
    this.container.addChild(this.noteContainer);

    this.cull = new Cull();
    this.cull.add(this.noteContainer);

    this.disposers.push(
      autorun(() => {
        this.container.pivot.set(
          this.renderer.calcX(0),
          this.renderer.calcY(0)
        );
        this.line.y = this.renderer.calcY(0);
      }),
      autorun(() => this.updateNotes())
    );
  }

  updateNotes(): void {
    const hashs: string[] = [];
    const added: { h: string; n: NoteRenderer }[] = [];
    chart.data?.judgeLineList[this.i]?.noteList.forEach((n) => {
      const h = hash(n);
      hashs.push(h);
      const note = this.notes.get(h);
      if (!note || note.forceUpdate) {
        if (note) {
          note.destory();
          this.notes.delete(h);
        }
        added.push({ h, n: new NoteRenderer(this, n) });
      }
    });
    runInAction(() => {
      this.notes.forEach((n, h) => {
        if (!hashs.includes(h)) {
          n.destory();
          this.notes.delete(h);
        }
      });
      added.forEach(({ h, n }) => this.notes.set(h, n));
    });
  }

  assign(i: number): void {
    this.i = i;
  }

  destory(): void {
    this.container.destroy({
      children: true,
    });
    this.notes.forEach((n) => n.destory());
    this.notes.clear();
  }

  update(): void {
    if (chart.data) {
      const data = chart.data.judgeLineList[this.i];
      const { tick } = timing;

      this.container.x = this.renderer.calcX(
        updater(data.props.controlX, tick)
      );
      this.container.y = this.renderer.calcY(
        updater(data.props.controlY, tick)
      );
      this.container.angle = updater(data.props.angle, tick);
      this.line.alpha = updater(data.props.lineAlpha, tick);
      this.noteContainer.alpha = updater(data.props.noteAlpha, tick);
      this.displayRange = updater(data.props.displayRange, tick);
    }

    this.notes.forEach((n) => n.update());

    this.cull.cull(this.renderer.app.renderer.screen);
  }

  calcDist(t1: number, t2?: number): number {
    if (!t2) {
      t2 = t1;
      t1 = timing.tick;
    }
    if (t1 > t2) return -this.calcDist(t2, t1);
    const arr = chart.data?.judgeLineList[this.i].props.speed ?? [];
    const l = search(arr, t1);
    const r = search(arr, t2);
    let ans = 0;
    for (let i = l; i <= r; i += 1) {
      if (i === -1) {
        ans += arr[0].value * (Math.min(t2, arr[0].time) - t1);
      } else if (i === arr.length - 1) {
        ans += arr[i].value * (t2 - Math.max(t1, arr[i].time));
      } else {
        ans +=
          (arr[i + 1].time - arr[i].time) *
          easeSumCalc(
            arr[i].value,
            arr[i + 1].value,
            Math.max(t1, arr[i].time) / (arr[i + 1].time - arr[i].time),
            Math.min(t2, arr[i + 1].time) / (arr[i + 1].time - arr[i].time),
            arr[i].easing
          );
      }
    }
    return ans;
  }
}
