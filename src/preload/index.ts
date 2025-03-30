// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Window control APIs
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  restore: () => ipcRenderer.invoke('restore-window'),
  close: () => ipcRenderer.invoke('close-window'),
  notify: () => ipcRenderer.invoke('notif'),
  
  // Plaid APIs - secure channel to main process
  plaid: {
    // Create a link token for initializing Plaid Link
    createLinkToken: () => ipcRenderer.invoke('plaid-create-link-token'),
    
    // Exchange a public token for an access token and create a new Plaid item
    exchangePublicToken: (publicToken, institutionId, institutionName) => 
      ipcRenderer.invoke('plaid-exchange-public-token', publicToken, institutionId, institutionName),
    
    // Get all Plaid items (bank connections)
    getPlaidItems: () => ipcRenderer.invoke('plaid-get-items'),
    
    // Get accounts for a specific Plaid item
    getPlaidAccounts: (itemId) => ipcRenderer.invoke('plaid-get-accounts', itemId),
    
    // Get transactions for a specific Plaid item and date range
    getTransactions: (itemId, startDate, endDate) => 
      ipcRenderer.invoke('plaid-get-transactions', itemId, startDate, endDate),
    
    // Update account balances for a Plaid item
    updateAccountBalances: (itemId) => ipcRenderer.invoke('plaid-update-balances', itemId),
    
    // Remove a Plaid item
    removePlaidItem: (itemId) => ipcRenderer.invoke('plaid-remove-item', itemId)
  }
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