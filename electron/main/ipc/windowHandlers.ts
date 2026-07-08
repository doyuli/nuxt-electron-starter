import type { IpcMainInvokeEvent } from 'electron'
import { BrowserWindow, ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../shared/ipc-contract'

function getSenderWindow(event: IpcMainInvokeEvent): BrowserWindow {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (!window) {
    throw new Error('Unable to resolve sender window')
  }

  return window
}

export function registerWindowHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.window.close, (event) => {
    getSenderWindow(event).close()
  })

  ipcMain.handle(IPC_CHANNELS.window.minimize, (event) => {
    getSenderWindow(event).minimize()
  })

  ipcMain.handle(IPC_CHANNELS.window.toggleDevTools, (event) => {
    const webContents = getSenderWindow(event).webContents
    if (webContents.isDevToolsOpened()) {
      webContents.closeDevTools()
    }
    else {
      webContents.openDevTools({ mode: 'detach' })
    }
  })
}
