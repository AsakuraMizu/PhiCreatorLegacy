import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { URL } from 'url';

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

/**
 * Workaround for TypeScript bug
 * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
 */
const env = import.meta.env;

/**
 * Not work!
 */
// if (env.MODE === 'development') {
//   app
//     .whenReady()
//     .then(() => import('electron-devtools-installer'))
//     .then(({ default: installExtension }) =>
//       installExtension('ckolcbmkjpjmangdbmnkpjigpkddpogn', {
//         loadExtensionOptions: {
//           allowFileAccess: true,
//         },
//       })
//     )
//     .catch((e) => console.error('Failed install extension:', e));
// }

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
      enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    // mainWindow?.show();
    mainWindow?.maximize();

    if (env.MODE === 'development') {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    env.MODE === 'development'
      ? env.VITE_DEV_SERVER_URL
      : new URL(
          '../renderer/dist/index.html',
          'file://' + __dirname
        ).toString();

  await mainWindow.loadURL(pageUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.log(url);
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    } else {
      return { action: 'allow' };
    }
  });
};

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
  .then(createWindow)
  .catch((e) => console.error('Failed create window:', e));

// Auto-updates
if (env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

import './ipcHandler';
