import { extname, join } from 'path';
import { contextBridge, ipcRenderer, shell } from 'electron';
import {
  ensureDir,
  outputJSON,
  pathExists,
  readFile,
  readJSON,
} from 'fs-extra';
import storage from 'electron-json-storage';

const apiKey = 'api';

let chartFolder = '';

process.on('loaded', async () => {
  const userData = await ipcRenderer.invoke('get-data-dir');
  storage.setDataPath(userData);
});

/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
  readJSON: async <T>(file: string, fallback: T): Promise<T> => {
    const path = join(chartFolder, file);
    if (chartFolder) {
      return await readJSON(path);
    } else {
      return fallback;
    }
  },
  outputJSON: async <T>(file: string, data: T): Promise<void> => {
    if (chartFolder) {
      const path = join(chartFolder, file);
      await outputJSON(path, data);
    }
  },
  pathExists: async (file: string): Promise<boolean> => {
    const path = join(chartFolder, file);
    return file !== '' && (await pathExists(path));
  },
  readFile: async (file: string): Promise<Buffer> => {
    const path = join(chartFolder, file);
    return await readFile(path);
  },
  openChartFolder: () => {
    shell.openPath(chartFolder);
  },
  openProject: (folder: string) => {
    ensureDir(folder);
    chartFolder = folder;
  },
  dirSelector: async (): Promise<string> => {
    const res = await ipcRenderer.invoke('dir-selector');
    return res.filePaths.toString();
  },
  extname,
  storage,
} as const;

export type Api = Readonly<typeof api>;

contextBridge.exposeInMainWorld(apiKey, api);
