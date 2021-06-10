import { forward, sample } from 'effector';
import { meta, $load, save, $save } from './meta';
import { $load as musicLoad } from './music';

// load
meta.on($load.doneData, (_, payload) => payload);
forward({
  from: $load.doneData,
  to: [musicLoad],
});

// save
sample({
  source: meta,
  clock: save,
  target: $save,
});
