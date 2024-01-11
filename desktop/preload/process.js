const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  electron: () => ipcRenderer.send(process.versions['electron'])
});
