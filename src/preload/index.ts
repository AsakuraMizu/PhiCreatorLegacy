import { contextBridge } from 'electron';
import storage from 'electron-json-storage';
import { extname } from 'path';
import dialog from './dialog';
import project from './project';

const api = {
  project,
  dialog,
  extname,
  storage,
} as const;

export type Api = Readonly<typeof api>;

contextBridge.exposeInMainWorld('api', api);
