import {
  combine,
  createEffect,
  createEvent,
  createStore,
  merge,
} from 'effector';
import { Howl } from 'howler';
import { file2url } from '../common';
import { createInterval } from './helpers';
import type { IMeta } from './meta';

// music instance
export const instance = createStore(new Howl({ src: [''] }));

// music status
export const loaded = createStore(false, { name: 'music loaded' });
export const playing = createStore(false, { name: 'music playing' });
export const duration = createStore(1, { name: 'music duration' });
export const seek = createStore(0, { name: 'music seek' });
export const progress = combine(
  duration,
  seek,
  (duration, seek) => seek / duration
);

// control
export const play = createEvent('play music');
export const $play = createEffect({
  name: 'play music',
  handler: (instance: Howl) => instance.play(),
});

export const pause = createEvent('pause music');
export const $pause = createEffect({
  name: 'pause music',
  handler: (instance: Howl) => instance.pause(),
});

export const stop = createEvent('stop music');
export const $stop = createEffect({
  name: 'stop music',
  handler: (instance: Howl) => instance.stop(),
});

// update interval
export const _interval = createInterval({
  name: '(internal)music',
  start: play,
  pause: merge([pause, stop]),
  interval: 10,
});

// file operations
export const $load = createEffect({
  name: 'load music',
  handler: async (meta: IMeta) => {
    const src = await file2url(meta.music);
    return new Promise<Howl>((rs, rj) => {
      const howl = new Howl({
        src,
        format: [window.api.helpers.extname(meta.music).split('.')[1]],
      });
      howl.once('load', () => rs(howl));
      howl.once('loaderror', rj);
    });
  },
});
