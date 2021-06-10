import {
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
} from 'effector';
import type { Event } from 'effector';

export function createInterval({
  name,
  start,
  pause = createEvent(`${name} pause`),
  interval = 1000,
}: {
  name: string;
  start: Event<void>;
  pause?: Event<void>;
  interval?: number;
}): Event<void> {
  const working = createStore(false, { name: `${name} working` });
  const tick = createEvent(`${name} tick`);
  const $timer = createEffect({
    name: `${name} timer`,
    handler: () => new Promise((rs) => setTimeout(rs, interval)),
  });

  working.on(start, () => true).on(pause, () => false);

  guard({
    source: start,
    filter: $timer.pending.map((is) => !is),
    target: tick,
  });

  guard({
    source: $timer.done,
    filter: working,
    target: tick,
  });

  forward({
    from: tick,
    to: $timer,
  });

  return tick;
}
