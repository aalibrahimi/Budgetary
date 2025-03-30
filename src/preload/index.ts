import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'


function getIconPathByType(type: string): string {
  switch(type) {
    case 'success':
      return './assets/icons/success.png';
    case 'warning':
      return './assets/icons/warning.png';
    case 'error':
      return './assets/icons/error.png';
    case 'info':
    default:
      return './assets/icons/info.png';
  }
}

// Custom APIs for renderer
const api = {
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  restore: () => ipcRenderer.invoke('restore-window'),
  close: () => ipcRenderer.invoke('close-window'),
  notify: () => ipcRenderer.invoke('notif'),
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
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
