import dialog from './dialog';
import helpers from './helpers';
import project from './project';
import storage from './storage';

export const api = {
  dialog,
  helpers,
  project,
  storage,
  versions: process.versions,
};

export type Api = Readonly<typeof api>;
