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

let projectFolder = '';

process.on('loaded', async () => {
  const userData = await ipcRenderer.invoke('get-data-dir');
  storage.setDataPath(userData);
});

/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
  readJSON: async <T>(file: string, fallback: T): Promise<T> => {
    const path = join(projectFolder, file);
    if (projectFolder && (await pathExists(path))) {
      return await readJSON(path);
    } else {
      return fallback;
    }
  },
  outputJSON: async <T>(file: string, data: T): Promise<void> => {
    const path = join(projectFolder, file);
    if (projectFolder) {
      await outputJSON(path, data);
    }
  },
  pathExists: async (file: string): Promise<boolean> => {
    const path = join(projectFolder, file);
    return file !== '' && (await pathExists(path));
  },
  readFile: async (file: string): Promise<Buffer> => {
    const path = join(projectFolder, file);
    return await readFile(path);
  },
  openProjectFolder: () => {
    shell.openPath(projectFolder);
  },
  openProject: async (folder: string) => {
    projectFolder = folder;
    await ensureDir(folder);
  },
  dirSelector: async (): Promise<string> => {
    const result: OpenDialogReturnValue = await ipcRenderer.invoke(
      'dir-selector'
    );
    return result.filePaths.toString();
  },
  fileSelector: async (path: string): Promise<string> => {
    const result: OpenDialogReturnValue = await ipcRenderer.invoke(
      'file-selector',
      path
    );
    return result.filePaths.toString();
  },
  getProjectFolder: () => {
    return projectFolder;
  },
  extname,
  storage,
} as const;

export type Api = Readonly<typeof api>;

contextBridge.exposeInMainWorld(apiKey, api);
