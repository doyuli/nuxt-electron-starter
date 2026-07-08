export const IPC_CHANNELS = {
  app: {
    getVersion: 'app:get-version',
  },
  dialog: {
    openFile: 'dialog:open-file',
    saveFile: 'dialog:save-file',
  },
  shell: {
    openPath: 'shell:open-path',
    showItemInFolder: 'shell:show-item-in-folder',
    openExternal: 'shell:open-external',
  },
  window: {
    close: 'window:close',
    minimize: 'window:minimize',
    toggleDevTools: 'window:toggle-dev-tools',
  },
} as const

export type IpcChannel
  = | typeof IPC_CHANNELS.app[keyof typeof IPC_CHANNELS.app]
    | typeof IPC_CHANNELS.dialog[keyof typeof IPC_CHANNELS.dialog]
    | typeof IPC_CHANNELS.shell[keyof typeof IPC_CHANNELS.shell]
    | typeof IPC_CHANNELS.window[keyof typeof IPC_CHANNELS.window]

export interface FileFilter {
  name: string
  extensions: string[]
}

export type OpenFileProperty
  = | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
    | 'createDirectory'
    | 'promptToCreate'
    | 'noResolveAliases'
    | 'treatPackageAsDirectory'
    | 'dontAddToRecent'

export interface OpenFileOptions {
  title?: string
  defaultPath?: string
  buttonLabel?: string
  filters?: FileFilter[]
  properties?: OpenFileProperty[]
}

export interface OpenFileResult {
  canceled: boolean
  filePaths: string[]
}

export interface SaveFileOptions {
  title?: string
  defaultPath?: string
  buttonLabel?: string
  filters?: FileFilter[]
}

export interface SaveFileResult {
  canceled: boolean
  filePath?: string
}

export interface ElectronAPI {
  app: {
    getVersion: () => Promise<string>
  }
  dialog: {
    openFile: (options?: OpenFileOptions) => Promise<OpenFileResult>
    saveFile: (options?: SaveFileOptions) => Promise<SaveFileResult>
  }
  shell: {
    openPath: (targetPath: string) => Promise<string>
    showItemInFolder: (targetPath: string) => Promise<void>
    openExternal: (url: string) => Promise<void>
  }
  window: {
    close: () => Promise<void>
    minimize: () => Promise<void>
    toggleDevTools: () => Promise<void>
  }
}
