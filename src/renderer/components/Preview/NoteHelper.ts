import { makeAutoObservable } from 'mobx';
import { Instance } from 'mobx-state-tree';
import * as PIXI from 'pixi.js';
import { control, fx, music, timing } from '/@/managers';
import store from '/@/store';
import SingleNote from '/@/store/chart/note';
import { JudgeLineHelper } from './JudgeLineHelper';
import { JudgerContainer } from './Judger';

import skin from '/@/assets/skin/skin.json';

export class NoteHelper {
  constructor(
    public judgeLine: JudgeLineHelper,
    public data: Instance<typeof SingleNote>
  ) {
    makeAutoObservable(this);
  }

  counted = false;
  restTime = 0;

  update(note: PIXI.Sprite, judger: JudgerContainer | null): void {
    const d = this.judgeLine.calcDist(this.data.time) * this.data.speed;
    note.y = store.preview.y(d * this.data.side);
    const { displayRange: dr } = this.judgeLine;
    note.visible = d >= 1e-5 && (dr < 0 || d - dr < 1e-5);

    if (timing.tick > this.data.time && this.counted === false) {
      store.preview.incCombo();
      this.counted = true;
    }
    if (timing.tick < this.data.time && this.counted === true) {
      store.preview.decCombo();
      this.counted = false;
    }

    if (
      music.playing &&
      this.data.time - timing.tick < 1e-5 &&
      timing.tick - this.data.time <= 10 &&
      timing.tick - (this.data.time + this.data.holdTime) <= 10
    ) {
      if (this.restTime < 1e-5) {
        if (judger && this.judgeLine.notes)
          judger.playOnce(
            this.judgeLine.notes.toGlobal({
              x: store.preview.x(this.data.x),
              y: store.preview.y(0),
            })
          );
        fx.play(this.data.type);
        this.restTime = skin.effect.interval;
      }
    }
    this.restTime -= PIXI.Ticker.shared.elapsedMS;
  }

  updateHold(
    note: PIXI.Container,
    hold: PIXI.Sprite,
    holdHead: PIXI.Sprite,
    holdEnd: PIXI.Sprite,
    judger: JudgerContainer | null
  ): void {
    const d1 = this.judgeLine.calcDist(this.data.time) * this.data.speed;
    const d2 =
      this.judgeLine.calcDist(this.data.time + this.data.holdTime) *
      this.data.speed;
    const { displayRange: dr } = this.judgeLine;
    const bottom = Math.max(d1, 0);
    const top = dr < 0 ? d2 : Math.min(d2, dr);

    note.y = store.preview.y(top * this.data.side);
    note.visible = d2 >= 1e-5 && (dr < 0 || d1 - dr < 1e-5);
    note.pivot.x = holdHead.width / 2;
    note.pivot.y = holdEnd.height;
    hold.y = holdEnd.height;
    hold.scale.y =
      ((top - bottom) * (store.preview.height / 2)) /
      skin.noteRatio /
      hold.texture.height;
    holdHead.y = holdEnd.height + hold.height;
    holdHead.visible = bottom >= 1e-5;

    if (
      timing.tick > this.data.time + this.data.holdTime &&
      this.counted === false &&
      control.full
    ) {
      store.preview.incCombo();
      this.counted = true;
    }
    if (
      timing.tick < this.data.time + this.data.holdTime &&
      this.counted === true &&
      control.full
    ) {
      store.preview.decCombo();
      this.counted = false;
    }

    if (
      music.playing &&
      this.data.time - timing.tick < 1e-5 &&
      timing.tick - (this.data.time + this.data.holdTime) <= 10
    ) {
      if (this.restTime < 1e-5) {
        if (judger && this.judgeLine.notes)
          judger.playOnce(
            this.judgeLine.notes.toGlobal({
              x: store.preview.x(this.data.x),
              y: store.preview.y(0),
            })
          );
        fx.play(this.data.type);
        this.restTime = skin.effect.interval;
      }
      if (this.data.time + this.data.holdTime - timing.tick < 1e-5)
        this.restTime = skin.effect.interval;
    }
    this.restTime -= PIXI.Ticker.shared.elapsedMS;
  }
}
