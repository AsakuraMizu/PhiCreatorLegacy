import { createApi, createEffect, createEvent, createStore } from 'effector';

// interface
export interface IMeta {
  title: string;
  difficulty: string;
  artist: string;
  illustrator: string;
  charter: string;
  music: string;
  background: string;
}

// data
export const meta = createStore<IMeta>(
  {
    title: '',
    difficulty: '',
    artist: '',
    illustrator: '',
    charter: '',
    music: '',
    background: '',
  },
  { name: 'meta data', updateFilter: (update) => !!update }
);

// update api
export const { update } = createApi(meta, {
  update: (meta, payload: Partial<IMeta>) => ({ ...meta, ...payload }),
});

// file operations
export const fileName = 'meta.json';

export const $load = createEffect({
  name: 'load meta',
  handler: () => window.api.project.readJSON<IMeta>(fileName),
});

export const save = createEvent('save meta');
export const $save = createEffect<(params: IMeta) => Promise<void>>({
  name: 'save meta',
  handler: (params) => window.api.project.outputJSON(fileName, params),
});
