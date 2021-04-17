import { reaction } from 'mobx';
import { Howl } from 'howler';
import { NoteData } from '../common';
import Tap from '/@/assets/skin/tap.wav';
import Drag from '/@/assets/skin/drag.wav';
import Flick from '/@/assets/skin/flick.wav';
import settings from './settings';

class FxManager {
  tap: Howl;
  drag: Howl;
  flick: Howl;

  constructor() {
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
}

const fx = new FxManager();

export default fx;
