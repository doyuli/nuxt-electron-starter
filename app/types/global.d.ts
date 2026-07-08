import type { ElectronAPI } from '~~/electron/shared/ipc-contract'

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
