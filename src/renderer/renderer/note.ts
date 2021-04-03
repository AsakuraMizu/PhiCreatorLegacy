import { Container, Sprite } from 'pixi.js';
import { chart, timing } from '/@/managers';
import { NoteData, search } from '/@/common';
import type JudgeLineRenderer from './judge-line';
import { loadedRes, skin } from './resources';

export default class NoteRenderer {
  judgeLineRenderer: JudgeLineRenderer;
  data: NoteData;
  container: Container;
  sprite!: Sprite;
  hold!: Sprite;
  holdHead!: Sprite;
  holdEnd!: Sprite;
  restTime = 0;

  hl = false;
  forceUpdate = false;

  constructor(judgeLineRenderer: JudgeLineRenderer, data: NoteData) {
    this.data = data;
    this.judgeLineRenderer = judgeLineRenderer;

    this.container = new Container();
    if (this.data.type !== 3) {
      const { noteList } = this.judgeLineRenderer.renderer;
      const l = search(noteList, this.data.time);
      this.hl =
        Math.abs(noteList[l]?.time - this.data.time) < 1e-5 ||
        Math.abs(noteList[l + 2]?.time - this.data.time) < 1e-5;
      this.sprite = new Sprite(
        (this.hl
          ? {
              1: loadedRes.TapHL,
              2: loadedRes.DragHL,
              4: loadedRes.FlickHL,
            }
          : {
              1: loadedRes.Tap,
              2: loadedRes.Drag,
              4: loadedRes.Flick,
            })[this.data.type]
      );
      this.container.addChild(this.sprite);
      this.container.pivot.y = this.container.height / 2;
    } else {
      this.hold = new Sprite(loadedRes.Hold);
      this.holdHead = new Sprite(loadedRes.HoldHead);
      this.holdEnd = new Sprite(loadedRes.HoldEnd);
      this.hold.y = this.holdEnd.height;
      this.container.addChild(this.holdEnd, this.hold, this.holdHead);
      this.container.pivot.y = this.holdEnd.height;
    }
    this.container.pivot.x = this.container.width / 2;
    this.container.scale.x = skin.noteRatio * this.data.width;
    this.container.scale.y = this.data.side * skin.noteRatio;

    this.judgeLineRenderer.noteContainer.addChild(this.container);
  }

  destory(): void {
    this.container.destroy({
      children: true,
    });
  }

  update(): void {
    const d1 =
      (this.judgeLineRenderer.calcDist(this.data.time) * this.data.speed) /
      (chart.data?.timingBase ?? 48);
    const d2 =
      (this.judgeLineRenderer.calcDist(
        this.data.time + (this.data.type === 3 ? this.data.holdTime : 0)
      ) *
        this.data.speed) /
      (chart.data?.timingBase ?? 48);
    this.container.position.x = this.judgeLineRenderer.renderer.calcX(
      this.data.x
    );
    this.container.position.y = this.judgeLineRenderer.renderer.calcY(
      this.data.side * d2
    );
    const { displayRange: dr } = this.judgeLineRenderer;
    this.container.renderable = d2 >= -1e-5 && (dr < 0 || d2 - dr < 1e-5);
    if (this.data.type === 3) {
      this.hold.scale.y =
        (Math.min(Math.abs(d2), Math.abs(d2 - d1)) *
          (this.judgeLineRenderer.renderer.height / 2)) /
        skin.noteRatio /
        this.hold.texture.height;
      this.holdHead.y = this.holdEnd.height + this.hold.height;
      this.holdHead.renderable = d1 >= -1e-5;
    }

    if (
      this.data.time - timing.tick < 1e-5 &&
      this.data.time - timing.tick > 1
    ) {
      if (this.restTime < 1e-5) {
        this.judgeLineRenderer.renderer.judger.playOnce(
          this.judgeLineRenderer.noteContainer.toGlobal({
            x: this.judgeLineRenderer.renderer.calcX(this.data.x),
            y: this.judgeLineRenderer.renderer.calcY(0),
          })
        );
        this.restTime = skin.effect.interval;
      }
      if (this.data.time + this.data.holdTime - timing.tick < 1e-5)
        this.restTime = skin.effect.interval;
    }
    this.restTime -= this.judgeLineRenderer.renderer.app.ticker.elapsedMS;

    const { noteList } = this.judgeLineRenderer.renderer;
    const l = search(noteList, this.data.time);
    const hl =
      this.data.type !== 3 &&
      (Math.abs(noteList[l]?.time - this.data.time) < 1e-5 ||
        Math.abs(noteList[l + 2]?.time - this.data.time) < 1e-5);
    if (hl !== this.hl) {
      this.forceUpdate = true;
      this.judgeLineRenderer.updateNotes();
    }
  }
}
