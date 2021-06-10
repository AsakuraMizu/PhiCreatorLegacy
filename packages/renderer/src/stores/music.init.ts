import { guard, sample } from 'effector';
import {
  instance,
  playing,
  play,
  $play,
  pause,
  $pause,
  stop,
  $stop,
  $load,
  duration,
  loaded,
  seek,
  _interval,
} from './music';

// control
playing
  .on(play, () => true)
  .on(pause, () => false)
  .on(stop, () => false);

guard({
  clock: play,
  source: instance,
  filter: loaded,
  target: $play,
});

guard({
  clock: pause,
  source: instance,
  filter: loaded,
  target: $pause,
});

guard({
  clock: stop,
  source: instance,
  filter: loaded,
  target: $stop,
});

// seek update
sample({
  clock: _interval,
  source: instance,
  fn: (instance) => instance.seek() as number,
  target: seek,
});

// music load
loaded.on($load.done, () => true);
instance.on($load.doneData, (state, payload) => {
  if (state.playing()) state.stop();
  return payload;
});
duration.on(instance, (_, instance) => instance.duration());
seek.on(instance, (_, instance) => instance.seek() as number);
