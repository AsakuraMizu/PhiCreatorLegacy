import { ipcMain, app } from 'electron';

ipcMain.handle('get-data-dir', async () => app.getPath('userData'));
