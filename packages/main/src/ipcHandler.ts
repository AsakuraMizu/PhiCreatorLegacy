import { ipcMain, app, dialog } from 'electron';

ipcMain.handle('get-data-dir', async () => app.getPath('userData'));

ipcMain.handle(
  'dir-selector',
  async () =>
    await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    })
);

ipcMain.handle(
  'file-selector',
  async (_, path) =>
    await dialog.showOpenDialog({
      defaultPath: path,
    })
);
