import { ipcRenderer, shell } from 'electron';
import type { OpenDialogReturnValue } from 'electron';
import {
  ensureDir,
  outputJSON,
  pathExists,
  readFile,
  readJSON,
} from 'fs-extra';
import { isAbsolute, relative, join } from 'path';

let workingDirectory = '';

export default {
  readJSON: async <T>(file: string): Promise<T> => {
    const path = join(workingDirectory, file);
    if (workingDirectory && (await pathExists(path))) {
      return await readJSON(path);
    }
    throw new Error(`readJSON(${file})`);
  },
  outputJSON: async <T>(file: string, data: T): Promise<void> => {
    if (workingDirectory) {
      await outputJSON(join(workingDirectory, file), data);
    }
  },
  readFile: async (file: string): Promise<Buffer> => {
    const path = join(workingDirectory, file);
    if (workingDirectory && file !== '' && (await pathExists(path)))
      return await readFile(path);
    throw new Error(`readFile(${file})`);
  },
  selectFile: async (): Promise<string> => {
    const result: OpenDialogReturnValue = await ipcRenderer.invoke(
      'file-selector',
      workingDirectory
    );
    return result.filePaths.toString();
  },
  openFolder: (): void => {
    shell.openPath(workingDirectory);
  },
  startProject: async (): Promise<boolean> => {
    const path = (
      (await ipcRenderer.invoke('dir-selector')) as OpenDialogReturnValue
    ).filePaths.toString();
    if (!path) return false;
    await ensureDir(path);
    workingDirectory = path;
    return true;
  },
  getWorkingDirectory: (): string => {
    return workingDirectory;
  },
  toRelative: (path: string): string => {
    if (!workingDirectory) return '';
    const result = relative(workingDirectory, path);
    if (!result || isAbsolute(result) || result.startsWith('..')) return '';
    return result;
  },
};
