import type { ElectronAPI } from '~~/electron/shared/ipc-contract'
import { computed } from 'vue'

export function useElectronBridge() {
  const api = computed(() => import.meta.client ? window.electronAPI : undefined)
  const isAvailable = computed(() => Boolean(api.value))

  function getElectronApi(): ElectronAPI {
    const electronAPI = api.value

    if (!electronAPI) {
      throw new Error('Preload bridge is only available inside Electron.')
    }

    return electronAPI
  }

  return {
    api,
    isAvailable,
    getElectronApi,
  }
}
