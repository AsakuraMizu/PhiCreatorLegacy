import { extname, join } from 'path';
import {
  contextBridge,
  ipcRenderer,
  shell,
  OpenDialogReturnValue,
} from 'electron';
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
    if (chartFolder && (await pathExists(path))) {
      return await readJSON(path);
    } else {
      return fallback;
    }
  },
  outputJSON: async <T>(file: string, data: T): Promise<void> => {
    const path = join(chartFolder, file);
    if (chartFolder) {
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
  openProject: async (folder: string) => {
    chartFolder = folder;
    await ensureDir(folder);
  },
  dirSelector: async (): Promise<string> => {
    const result: OpenDialogReturnValue = await ipcRenderer.invoke(
      'dir-selector'
    );
    return result.filePaths.toString();
  },
  extname,
  storage,
} as const;

export type Api = Readonly<typeof api>;

contextBridge.exposeInMainWorld(apiKey, api);
