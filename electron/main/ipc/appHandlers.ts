import { app, ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../shared/ipc-contract'

export function registerAppHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.app.getVersion, () => app.getVersion())
}
