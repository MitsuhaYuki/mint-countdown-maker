import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getSystemFonts: () => ipcRenderer.invoke('get-system-fonts'),
  selectBackgroundImage: () => ipcRenderer.invoke('select-background-image'),
  saveVideoDialog: () => ipcRenderer.invoke('save-video-dialog'),
  saveVideoFile: (filePath, buffer) => ipcRenderer.invoke('save-video-file', filePath, buffer)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
