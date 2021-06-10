import project from './project';
import storage from './storage';
import helpers from './helpers';

export const api = {
  project,
  storage,
  helpers,
  versions: process.versions,
};

export type Api = Readonly<typeof api>;
