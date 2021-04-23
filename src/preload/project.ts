import { ipcRenderer, shell } from 'electron';
import storage from 'electron-json-storage';
import {
  ensureDir,
  outputJSON,
  pathExists,
  readFile,
  readJSON,
} from 'fs-extra';
import { relative, join } from 'path';

process.on('loaded', async () => {
  const userData = await ipcRenderer.invoke('get-data-dir');
  storage.setDataPath(userData);
});

let projectFolder = '';

export default {
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
  openProjectFolder: (): void => {
    shell.openPath(projectFolder);
  },
  openProject: async (folder: string): Promise<void> => {
    projectFolder = folder;
    await ensureDir(folder);
  },
  getProjectFolder: (): string => {
    return projectFolder;
  },
  getRelativePath: (path: string): string => {
    if (!projectFolder) return '';
    const relativePath = relative(projectFolder, path);
    if (relativePath.startsWith('..')) return '';
    return relativePath;
  },
};
