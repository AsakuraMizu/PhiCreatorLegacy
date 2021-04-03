import { ipcMain, app, dialog } from 'electron';

ipcMain.handle('get-data-dir', async () => app.getPath('userData'));

ipcMain.handle(
  'dir-selector',
  async () =>
    await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    })
);
