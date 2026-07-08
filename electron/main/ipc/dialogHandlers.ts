import type { IpcMainInvokeEvent, OpenDialogOptions, SaveDialogOptions } from 'electron'
import {
  BrowserWindow,
  dialog,
  ipcMain,

} from 'electron'
import { IPC_CHANNELS } from '../../shared/ipc-contract'
import { parseOpenFileOptions, parseSaveFileOptions } from '../../shared/ipc-schemas'

function getSenderWindow(event: IpcMainInvokeEvent): BrowserWindow | undefined {
  return BrowserWindow.fromWebContents(event.sender) ?? undefined
}

function showOpenDialog(event: IpcMainInvokeEvent, options: OpenDialogOptions) {
  const senderWindow = getSenderWindow(event)
  return senderWindow ? dialog.showOpenDialog(senderWindow, options) : dialog.showOpenDialog(options)
}

function showSaveDialog(event: IpcMainInvokeEvent, options: SaveDialogOptions) {
  const senderWindow = getSenderWindow(event)
  return senderWindow ? dialog.showSaveDialog(senderWindow, options) : dialog.showSaveDialog(options)
}

export function registerDialogHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.dialog.openFile, async (event, rawOptions?: unknown) => {
    const options = parseOpenFileOptions(rawOptions)

    return showOpenDialog(event, {
      title: options?.title,
      defaultPath: options?.defaultPath,
      buttonLabel: options?.buttonLabel,
      filters: options?.filters,
      properties: options?.properties ?? ['openFile'],
    } satisfies OpenDialogOptions)
  })

  ipcMain.handle(IPC_CHANNELS.dialog.saveFile, async (event, rawOptions?: unknown) => {
    const options = parseSaveFileOptions(rawOptions)

    return showSaveDialog(event, {
      title: options?.title,
      defaultPath: options?.defaultPath,
      buttonLabel: options?.buttonLabel,
      filters: options?.filters,
    } satisfies SaveDialogOptions)
  })
}
