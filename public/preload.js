const { contextBridge, ipcRenderer } = require('electron')

// Exponer APIs seguras al proceso de renderizado
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('app-version'),
  getAppName: () => ipcRenderer.invoke('app-name'),
  
  // Menu events
  onNewProduct: (callback) => ipcRenderer.on('menu-new-product', callback),
  onAbout: (callback) => ipcRenderer.on('menu-about', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
})