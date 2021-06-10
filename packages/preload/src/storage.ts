import { ipcRenderer } from 'electron';
import storage from 'electron-json-storage';

process.on('loaded', async () => {
  const userData = await ipcRenderer.invoke('get-data-dir');
  storage.setDataPath(userData);
});

export default storage;
