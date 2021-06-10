import { forward } from 'effector';
import { load } from './project';
import { $load as metaLoad } from './meta';
import { $load as chartLoad } from './chart';

forward({
  from: load,
  to: [metaLoad, chartLoad],
});
