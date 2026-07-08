import type { ElectronAPI, IpcChannel } from '../shared/ipc-contract'
import { ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/ipc-contract'

function invoke<T>(channel: IpcChannel, ...args: unknown[]): Promise<T> {
  return ipcRenderer.invoke(channel, ...args) as Promise<T>
}

export const electronAPI: ElectronAPI = {
  app: {
    getVersion: () => invoke(IPC_CHANNELS.app.getVersion),
  },
  dialog: {
    openFile: options => invoke(IPC_CHANNELS.dialog.openFile, options),
    saveFile: options => invoke(IPC_CHANNELS.dialog.saveFile, options),
  },
  shell: {
    openPath: targetPath => invoke(IPC_CHANNELS.shell.openPath, targetPath),
    showItemInFolder: targetPath => invoke(IPC_CHANNELS.shell.showItemInFolder, targetPath),
    openExternal: url => invoke(IPC_CHANNELS.shell.openExternal, url),
  },
  window: {
    close: () => invoke(IPC_CHANNELS.window.close),
    minimize: () => invoke(IPC_CHANNELS.window.minimize),
    toggleDevTools: () => invoke(IPC_CHANNELS.window.toggleDevTools),
  },
}
