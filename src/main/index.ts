/*
 *  TODO: Refactor this file
 */

import { join } from 'path';
import { URL } from 'url';
import { app, BrowserWindow, shell } from 'electron';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  /**
   * Workaround for TypeScript bug
   * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
   */
  const env = import.meta.env;

  if (env.MODE === 'development') {
    app
      .whenReady()
      .then(() => import('electron-devtools-installer'))
      .then(({ default: installExtension }) => {
        const REACT_DEVELOPER_TOOLS = 'fmkadmapgofadopljbjfkapdkoienihi';
        const MOBX_DEVELOPER_TOOLS = 'pfgnfdagidkfgccljigdamigbcnndkod';
        return installExtension([REACT_DEVELOPER_TOOLS, MOBX_DEVELOPER_TOOLS]);
      })
      .catch((e) => console.error('Failed install extension:', e));
  }

  let mainWindow: BrowserWindow | null = null;

  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app
    .whenReady()
    .then(async () => {
      mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          preload: join(__dirname, '../preload/index.cjs.js'),
          contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
          // enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
          enableRemoteModule: true,
        },
      });

      /**
       * URL for main window.
       * Vite dev server for development.
       * `file://../renderer/index.html` for production and test
       */
      const pageUrl =
        env.MODE === 'development'
          ? env.VITE_DEV_SERVER_URL
          : new URL('renderer/index.html', 'file://' + __dirname).toString();

      await mainWindow.loadURL(pageUrl);
      mainWindow.maximize();
      mainWindow.show();

      if (env.MODE === 'development') {
        mainWindow.webContents.openDevTools();
      }

      mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return {
          action: 'deny',
        };
      });
    })
    .catch((e) => console.error('Failed create window:', e));

  // Auto-updates
  if (env.PROD) {
    app
      .whenReady()
      .then(() => import('electron-updater'))
      .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
      .catch((e) => console.error('Failed check updates:', e));
  }
}
