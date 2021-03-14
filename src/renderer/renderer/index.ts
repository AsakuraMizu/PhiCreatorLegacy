import { action, autorun, makeAutoObservable } from 'mobx';
import { Application } from 'pixi.js';
import { search } from '/@/common';
import { chart, timing } from '/@/managers';
import JudgeLineRenderer from './judge-line';
import UiRenderer from './ui';
import Judger from './judger';

export default class Renderer {
  canvas: HTMLCanvasElement;
  app: Application;
  width = 800;
  height = 600;
  ui: UiRenderer;
  judger: Judger;
  judgeLines: JudgeLineRenderer[] = [];

  constructor(canvas: HTMLCanvasElement) {
    makeAutoObservable(this, {
      canvas: false,
      app: false,
      ui: false,
      updateLines: action.bound,
    });

    this.canvas = canvas;
    this.app = new Application({
      view: canvas,
    });
    this.resize();

    this.ui = new UiRenderer(this);
    this.judger = new Judger(this);

    autorun(() => this.updateLines());

    this.app.ticker.add(() => this.update());
  }

  resize(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width < 800 && height < 600) {
      this.width = 800;
      this.height = (this.width * height) / width;
      this.app.renderer.resolution = width / this.width;
    } else {
      this.width = width;
      this.height = height;
    }
    this.app.renderer.resize(this.width, this.height);
  }

  updateLines(): void {
    if (chart.data) {
      const delta = chart.data.judgeLineList.length - this.judgeLines.length;
      switch (Math.sign(delta)) {
        case 0:
          break;
        case 1:
          this.judgeLines.push(
            ...Array.from({ length: delta }, (_, i) => i).map(
              (i) => new JudgeLineRenderer(this, this.judgeLines.length + i)
            )
          );
          break;
        case -1:
          this.judgeLines.splice(this.judgeLines.length + delta, -delta);
          break;
        default:
          break;
      }
      this.judgeLines.forEach((l, i) => {
        l.assign(i);
      });
    }
  }

  destroy(): void {
    this.app?.destroy(false, {
      children: true,
      texture: false,
      baseTexture: false,
    });
    this.judgeLines.forEach((l) => l.destory());
    this.judgeLines = [];
  }

  update(): void {
    this.ui.update();
    this.judgeLines.forEach((l) => l.update());
  }

  calcX(x: number): number {
    return ((x + 1) * this.width) / 2;
  }

  calcY(y: number): number {
    return ((1 - y) * this.height) / 2;
  }

  get combo(): number {
    return search(this.comboList, timing.tick) + 1;
  }

  get comboList(): { time: number }[] {
    const res: { time: number }[] = [];
    chart.data?.judgeLineList.forEach((l) =>
      res.push(
        ...l.noteList
          .filter((n) => !n.isFake)
          .map((n) => ({
            time: n.time + (n.type === 3 ? n.holdTime : 0),
          }))
      )
    );
    res.sort((a, b) => a.time - b.time);
    return res;
  }

  get noteList(): { time: number }[] {
    const res: { time: number }[] = [];
    chart.data?.judgeLineList.forEach((l) =>
      res.push(
        ...l.noteList.map((n) => ({
          time: n.time,
        }))
      )
    );
    res.sort((a, b) => a.time - b.time);
    return res;
  }
}
