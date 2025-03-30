// src/main/index.ts - update to include Plaid services
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import appIcon from '../../resources/Budgetary_light.jpg?asset'
// Import the Plaid service
import { initPlaidService } from './plaidService'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1250,
    height: 875,
    show: false,
    autoHideMenuBar: true,
    // frame: false,
    icon: appIcon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.handle('minimize-window', (_) => {
    mainWindow.minimize()
  })
  ipcMain.handle('maximize-window', (_) => {
    mainWindow.maximize()
    return { fullStatus: true }
  })
  ipcMain.handle('restore-window', (_) => {
    mainWindow.restore()
    return { fullStatus: false }
  })
  ipcMain.handle('close-window', (_) => {
    mainWindow.close()
  })
}

function showCustomNotification() {
  const screen = require('electron').screen
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const notificationWindow = new BrowserWindow({
    x: width - 320, // Position 20px from the right
    y: height - 120, // Position 20px from the bottom
    width: 320,
    height: 120,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })
  
  // Load the HTML for the notification
  notificationWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href='../renderer/src/components/componentAssets/notificationButton.css'>
        <title>Notification</title>
      </head>
      <body class="flex items-center justify-center h-screen bg-transparent">
        <button class="group relative" id="notif-trans">
          <div class="absolute -right-2 -top-2 z-10">
            <div class="flex h-5 w-5 items-center justify-center">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-xl bg-gradient-to-bl from-gray-900 via-gray-950 to-black p-[1px] shadow-2xl shadow-emerald-500/20">
            <div class="relative flex items-center gap-4 rounded-xl bg-gray-950 px-6 py-3 transition-all duration-300 group-hover:bg-gray-950/50">
              <div class="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 transition-transform duration-300 group-hover:scale-110">
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" class="h-5 w-5 text-white">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
                </svg>
                <div class="absolute inset-0 rounded-lg bg-emerald-500/50 blur-sm transition-all duration-300 group-hover:blur-md"></div>
              </div>
              <div class="flex flex-col items-start">
                <span class="text-sm font-semibold text-white">New Updates</span>
                <span class="text-[10px] font-medium text-emerald-400/80">Check your notifications</span>
              </div>
              <div class="ml-auto flex items-center gap-1">
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 transition-transform duration-300 group-hover:scale-150"></div>
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-500/50 transition-transform duration-300 group-hover:scale-150 group-hover:delay-100"></div>
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-500/30 transition-transform duration-300 group-hover:scale-150 group-hover:delay-200"></div>
              </div>
            </div>
            <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 opacity-20 transition-opacity duration-300 group-hover:opacity-40"></div>
          </div>
        </button>
        <script>
          document.getElementById('notificationSound').play();
        </script>
      </body>
    </html>
  `)}`
  )

  // Auto-close the notification after 5 seconds
  setTimeout(() => {
    notificationWindow.close()
  }, 5000)
}

ipcMain.handle('notif', (_) => {
  showCustomNotification()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Initialize Plaid services
  initPlaidService()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})