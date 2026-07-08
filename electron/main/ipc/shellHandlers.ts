import { ipcMain, shell } from 'electron'
import { IPC_CHANNELS } from '../../shared/ipc-contract'
import { assertSafeExternalUrl } from '../security/externalUrl'

function assertNonEmptyPath(value: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Path must be a non-empty string')
  }

  return value
}

export function registerShellHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.shell.openPath, async (_event, targetPath: string) => {
    return shell.openPath(assertNonEmptyPath(targetPath))
  })

  ipcMain.handle(IPC_CHANNELS.shell.showItemInFolder, async (_event, targetPath: string) => {
    shell.showItemInFolder(assertNonEmptyPath(targetPath))
  })

  ipcMain.handle(IPC_CHANNELS.shell.openExternal, async (_event, url: string) => {
    await shell.openExternal(assertSafeExternalUrl(url))
  })
}
