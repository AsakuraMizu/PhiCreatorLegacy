import { extname, join } from 'path';
import { contextBridge, ipcRenderer, shell } from 'electron';
import {
  ensureDir,
  outputJSON,
  pathExists,
  readFile,
  readJSON,
} from 'fs-extra';
import settings from 'electron-settings';

const apiKey = 'api';

let chartFolder: string;

process.on('loaded', async () => {
  chartFolder = join(await ipcRenderer.invoke('get-data-dir'), 'chart');
  await ensureDir(chartFolder);
});

/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
  readJSON: async <T>(file: string, fallback: T): Promise<T> => {
    const path = join(chartFolder, file);
    if (!(await pathExists(path))) {
      await outputJSON(path, fallback);
      return fallback;
    }
    return await readJSON(path);
  },
  outputJSON: async <T>(file: string, data: T): Promise<void> => {
    const path = join(chartFolder, file);
    await outputJSON(path, data);
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
  extname,
  settings,
} as const;

export type Api = Readonly<typeof api>;

if (import.meta.env.MODE !== 'test') {
  /**
   * The "Main World" is the JavaScript context that your main renderer code runs in.
   * By default, the page you load in your renderer executes code in this world.
   *
   * @see https://www.electronjs.org/docs/api/context-bridge
   */
  contextBridge.exposeInMainWorld(apiKey, api);
} else {
  /**
   * Recursively Object.freeze() on objects and functions
   * @see https://github.com/substack/deep-freeze
   * @param obj Object on which to lock the attributes
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deepFreeze = (obj: any) => {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((prop) => {
        const val = obj[prop];
        if (
          (typeof val === 'object' || typeof val === 'function') &&
          !Object.isFrozen(val)
        ) {
          deepFreeze(val);
        }
      });
    }

    return Object.freeze(obj);
  };

  deepFreeze(api);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-var-requires
  (window as any).electronRequire = require;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any)[apiKey] = api;
}
