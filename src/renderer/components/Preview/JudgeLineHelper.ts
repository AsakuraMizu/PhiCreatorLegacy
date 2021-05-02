import React from 'react';
import { makeAutoObservable } from 'mobx';
import { Instance } from 'mobx-state-tree';
import * as PIXI from 'pixi.js';
import { timing } from '/@/managers';
import { easeCalc, easeSumCalc } from '/@/common';
import store from '/@/store';
import SingleJudgeLine from '/@/store/chart/judgeline';
import PropList from '/@/store/chart/prop';

function calcCurrent(props: Instance<typeof PropList>, time: number) {
  const { times } = props;
  let l = -1;
  let r = times.length;
  while (r - l > 1) {
    const m = Math.floor((l + r) / 2);
    if (time - times[m] < 1e-5) {
      r = m;
    } else {
      l = m;
    }
  }
  if (l === -1) {
    return props.nth(0)!.value;
  }
  if (l === times.length - 1) {
    return props.nth(l).value;
  }
  return easeCalc(
    props.nth(l).value,
    props.nth(l + 1).value,
    (time - props.nth(l).time) / (props.nth(l + 1).time - props.nth(l).time),
    props.nth(l).easing
  );
}

interface DistPoint {
  time: number;
  dist: number;
  speed: number;
  easing: number;
}

export class JudgeLineHelper {
  controlX = 0;
  controlY = 0;
  angle = 0;
  noteAlpha = 1;
  lineAlpha = 1;
  displayRange = -1;

  notes?: PIXI.Container;

  constructor(public data: Instance<typeof SingleJudgeLine>) {
    makeAutoObservable(this, {
      dist: false,
      calcDist: false,
      notes: false,
    });
  }

  get distPoints(): DistPoint[] {
    const distPoints: DistPoint[] = [];
    const { speed } = this.data.props;
    let curTime = 0;
    let curDist = 0;
    let curSpeed = 0;
    let curEasing = 0;
    speed.times.forEach((time, idx) => {
      const data = speed.nth(idx);
      curDist +=
        easeSumCalc(curSpeed, data.value, 0, 1, curEasing) * (time - curTime);
      curTime = time;
      curSpeed = data.value;
      curEasing = data.easing;
      distPoints.push({
        time: curTime,
        dist: curDist,
        speed: curSpeed,
        easing: curEasing,
      });
    });
    return distPoints;
  }

  dist(time: number): number {
    const { distPoints: list } = this;
    let l = -1;
    let r = list.length;
    while (r - l > 1) {
      const m = Math.floor((l + r) / 2);
      if (time - list[m].time < 1e-5) {
        r = m;
      } else {
        l = m;
      }
    }
    if (l === -1) {
      return list[0].speed * (list[0].time - time);
    } else if (l === list.length - 1) {
      return list[l].dist + list[l].speed * (time - list[l].time);
    } else {
      return (
        list[l].dist +
        easeSumCalc(
          list[l].speed,
          list[l + 1].speed,
          0,
          (time - list[l].time) / (list[l + 1].time - list[l].time),
          list[l].easing
        ) *
          (time - list[l].time)
      );
    }
  }

  calcDist(t1: number, t2?: number): number {
    if (!t2) {
      t2 = t1;
      t1 = timing.tick;
    }

    return (this.dist(t2) - this.dist(t1)) / store.chart.timingBase;
  }

  update(
    root: PIXI.Container,
    line: PIXI.Graphics,
    notes: PIXI.Container
  ): void {
    if (!this.notes) this.notes = notes;
    const { tick } = timing;

    this.controlX = calcCurrent(this.data.props.controlX, tick);
    this.controlY = calcCurrent(this.data.props.controlY, tick);
    this.angle = calcCurrent(this.data.props.angle, tick);
    this.noteAlpha = calcCurrent(this.data.props.noteAlpha, tick);
    this.lineAlpha = calcCurrent(this.data.props.lineAlpha, tick);
    this.displayRange = calcCurrent(this.data.props.displayRange, tick);

    root.x = store.preview.x(this.controlX);
    root.y = store.preview.y(this.controlY);
    root.angle = this.angle;
    notes.alpha = this.noteAlpha;
    line.alpha = this.lineAlpha;
  }
}

export const JudgeLineCtx = React.createContext<JudgeLineHelper | null>(null);
