import { computed, makeObservable, reaction } from 'mobx';
import { Howl } from 'howler';
import { search, NoteData } from '../common';
import Tap from '/@/assets/skin/tap.wav';
import Drag from '/@/assets/skin/drag.wav';
import Flick from '/@/assets/skin/flick.wav';
import chart from './chart';
import music from './music';
import settings from './settings';
import timing from './timing';

interface Fx {
  type: 1 | 2 | 3 | 4;
  time: number;
}

class FxManager {
  tap: Howl;
  drag: Howl;
  flick: Howl;

  constructor() {
    makeObservable(this, {
      fxCount: computed,
      fxList: computed,
    });

    this.tap = new Howl({ src: Tap });
    this.drag = new Howl({ src: Drag });
    this.flick = new Howl({ src: Flick });

    const all = [this.tap, this.drag, this.flick];

    reaction(
      () => settings.rate,
      (rate) => {
        all.forEach((h) => h.rate(rate));
      },
      {
        fireImmediately: true,
      }
    );
    reaction(
      () => settings.volume.fx,
      (volume) => {
        all.forEach((h) => h.volume(volume));
      },
      {
        fireImmediately: true,
      }
    );
  }

  play(type: NoteData['type']) {
    const h = {
      1: this.tap,
      2: this.drag,
      3: this.tap,
      4: this.flick,
    }[type];
    h.play();
  }

  enable() {
    reaction(
      () => [this.fxCount, music.playing] as [number, boolean],
      ([fxCount], [prevCount, prevPlaying]) => {
        if (fxCount > prevCount && prevPlaying) {
          for (let i = prevCount; i < fxCount; i += 1) {
            this.play(this.fxList[i].type);
          }
        }
      }
    );
  }

  get fxCount(): number {
    return search(this.fxList, timing.tick) + 1;
  }

  get fxList(): Fx[] {
    const res: Fx[] = [];
    chart.data?.judgeLineList.forEach((l) =>
      res.push(
        ...l.noteList
          .filter((n) => !n.isFake)
          .map((n) => ({ type: n.type, time: n.time }))
      )
    );
    return res;
  }
}

const fx = new FxManager();

export default fx;
