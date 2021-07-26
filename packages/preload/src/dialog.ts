import { ipcRenderer } from 'electron';
import type { OpenDialogReturnValue } from 'electron';

export default {
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
};
