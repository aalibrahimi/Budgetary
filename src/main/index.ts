import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import appIcon from '../../resources/Budgetary_light.jpg?asset'
import { Notification } from 'electron/main'
import ali_icon from '../../resources/aliWolf.png?asset'

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

  ensureNotificationsCLickable(mainWindow)

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

 // Update the showCustomNotification function to ensure it works well
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
    skipTaskbar: true, // Don't show in taskbar
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
        <style>
          body {
            overflow: hidden;
            background: transparent;
          }
          #notif-trans {
            position: relative;
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
          }
        </style>
      </head>
      <body class="flex items-center justify-center h-screen bg-transparent">
        <button class="group relative" id="notif-trans">
          <div class="absolute -right-2 -top-2 z-10">
            <div class="flex h-5 w-5 items-center justify-center">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
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
                <span class="text-[10px] font-medium text-emerald-400/80">Budgetary Notification</span>
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
        <audio id="notificationSound" autoplay>
          <source src="data:audio/wav;base64,UklGRrQJAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZAJAACBhYqFbF1fdJGmrKaRf3R1gIiAcWRhZ3uNnamnmIh4cHF+iIV3aWRqeYeWoaGYj4B0cXiCioZ6bmhsd4GNl5uXjoF4cneBiYR6cG1weIGIj5KQioJ+eHl+hIJ+enp7e4CDhoiHhIB+fX+ChIN/fHx9f4KFhoWCgH5/gIOEgn98fH6ChYaFgoB+f4GDhIJ/fHx/gYSGhYKAfn+Bg4SCf3x8f4GEhoWCgH5/gYOEgn98fICChYaFgoB9f4GDhIJ/fHyAgoWGhYKAfX+Bg4SCf3x8gIKFhoWCgH1/gYOEgn97fICChYeFgoB9f4GDhIJ/e3yAgoWHhYKAfX+Bg4SCf3t8gIKGh4WBf31/gYSEgn97fICDhoeFgX99f4GEhIJ/e3yBg4aHhYF/fX+BhISCf3t8gYOGh4WBf31/gYSEgn97fIGDhoeEgX99f4GEhIJ+e3yBg4eHhIF+fX+BhISCfnt8gYSHh4SBfn1/gYSEgn57fIGEh4eEgX59f4GEhIJ+eXuAhIeHhYJ+fX+Bg4OCfnl7gISHiIWCfn1/gYODgn55e4CEiIiFgn19foGDg4J+eXqAhIiIhYJ9fX6Bg4OCfnl6gISIiIWCfX1+gYODgn55eoCEiYmGgn19foCCgoJ+eXqAhYmJhoJ9fX6AgoKCfXh6gIWJiYaCfH1+gIKCgn14eoCFioqHgnx8fYCCgoJ9eHmAhYqKh4J8fH2AgoKCfXh5gIWLioeCfHx9gIKBgn14eYCGi4qHgnx8fYCCgYF9d3mAhoyLiIN8e3x/gYGBfXd5gIeMi4iDfHt8f4GBgX13eICHjYyJg3t7e3+BgYF9d3iAh42MiYN7e3t/gICBfXZ4f4eOjImDe3p7f4CAgX12eH+HjoyKg3p6en+AgIF9dnh/h4+NioN6ent/gICAfXZ3f4ePjYqDeXp6f4CAgH12d3+HkI6Lg3l5en+AgIB8dnd/iJCOi4N5eXl+gIB/fHZ3f4iQj4uDeXl5foCAfnx2dn+IkY+Mg3h4eX6AgH58dnZ/iJGQjIN4eHh+gH9+fHV1foiRkIyDeHd4foB/fnx1dX6IkpGNg3d3d36Af358dXV+iJKSjYN3d3d9f39+fHV0foiSko2Ed3Z2fX9/fnx1dH6Ik5ONhHd2dn1/f358dHR+iJOTjoR2dnZ9f39+fHR0fomTlI6Ednl5foCAf3x1c32HkI+KgXh5eoGDgoB8dXR+h4+NiIF6e3yCg4KAfXZ1foaNi4WBe32AhISCf314douIgn57e4CFhoaDf3x7gIWCfXx9gIaIiIWBfn6BhIKAf4KEhYOAfn+ChoWDgYGDhIKAgoSFg4B+gIOFhIOBgYODgoGChIWCgH6Ag4WEg4GBgoOCgYKEhYKAfoCDhYSDgYCCg4KBgoSFgoB+gIOFhIKAgIKDgoGChIWCgH6Ag4WEgoCAgYOCgYKEhYKAfYCDhYSCgICBg4KBgoSGg4B9f4OFhIKAgIGDgoGChIaDgH1/g4WEgoB/gYOCgYKEhoOAfX+DhYSCgH+Bg4KBgoSGg4B9f4OFhYOAf4GCgoGChIaDgH1/g4WFg4B/gYKCgIKEhoOAfX+DhoWDgH+BgoKAgYOGg4B9f4OGhYOAf4GCgoCBg4aDgH1/g4aFg4B+gYKCgIGDhoSAfX6DhoWDgH6BgoKAgYOGhIB9foOGhoSAfoGCgYCBg4aEgH1+g4aGhIB+gIKBgIGDhoSAfX6DhoaEgH6AgYGAgIOGhIB9foOGhoSAfoCAf3l9gouFfoGDgIJ/fX2Ahnx9g4J6goR9f4F+g4V8fYGFfH+DgH2AhICAfH6EfYCEgIB+fn6DgH6Cg32BgoKBf36Ag4B/gYF/gYCBgYCAgIGAgICAgYCBgYCAgICBgICAgICBgICAgICAgICAgICAgICAgIGAgICAgICAgICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" type="audio/wav">
        </audio>
        <script>
          // Auto-close after 5 seconds
          setTimeout(() => {
            const notification = document.getElementById('notif-trans');
            notification.style.opacity = '0';
            // Wait for opacity transition to finish, then close
            setTimeout(() => {
              window.close();
            }, 500);
          }, 5000);
        </script>
      </body>
    </html>
  `)}`
  )

   // Make sure the window is always on top
   notificationWindow.setAlwaysOnTop(true, 'pop-up-menu');


  // Auto-close the notification after 5 seconds
  setTimeout(() => {
    notificationWindow.close()
  }, 5000)
}

const NOTIFY_TITLE = 'Hello from Electron'
const NOTIFY_BODY = 'This is your notify'
ipcMain.handle('notif', (_) => {
  // Try to use both notification methods for reliability across platforms
  try {
    // First try the native Electron notification
    new Notification({ 
      title: NOTIFY_TITLE, 
      body: NOTIFY_BODY, 
      icon: appIcon 
    }).show();
    
    // Also show our custom notification window
    showCustomNotification();
  } catch (error) {
    console.error('Error showing notification:', error);
    // Fallback to just custom notification if native fails
    showCustomNotification();
  }
})

// Make these additional changes to src/main/index.ts

// Add this after the app.whenReady() call
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // This is important for notifications on Windows
  app.setAppUserModelId(process.execPath)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  
  // Register for notification activation events
  if (process.platform === 'win32') {
    app.setAppUserModelId(app.getName())
  }
})

// Also add this function to ensure notifications can work even if the app is minimized
// Add this near the createWindow function

function ensureNotificationsCLickable(mainWindow: BrowserWindow) {
  // Handle notification click events
  app.on('activate', () => {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  })
  
  // Ensure app doesn't exit when main window is closed (on macOS)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  // Make window visible when notification is clicked
  const showWindow = () => {
    if (mainWindow.isMinimized()) mainWindow.restore()
    if (!mainWindow.isVisible()) mainWindow.show()
    mainWindow.focus()
  }
  
  ipcMain.on('show-window', showWindow)
  
  // Ensure we have permission to show notifications
  if (Notification.isSupported()) {
    // Notifications are automatically allowed in Electron if supported
    return true
  }
}


