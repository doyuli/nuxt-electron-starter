import type { BrowserWindow } from 'electron'
import process from 'node:process'
import { app } from 'electron'
import { registerIpcHandlers } from './ipc'
import { createMainWindow } from './windows/createMainWindow'

if (process.platform === 'win32') {
  app.setAppUserModelId('com.doyuli.nuxt-electron-starter')
}

const gotSingleInstanceLock = app.requestSingleInstanceLock()

if (!gotSingleInstanceLock) {
  app.quit()
}
else {
  let mainWindow: BrowserWindow | null = null

  app.on('second-instance', () => {
    if (!mainWindow) {
      return
    }

    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  })

  app.whenReady().then(async () => {
    registerIpcHandlers()
    mainWindow = await createMainWindow()

    app.on('activate', async () => {
      if (mainWindow === null) {
        mainWindow = await createMainWindow()
      }
    })
  })

  app.on('window-all-closed', () => {
    mainWindow = null
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
