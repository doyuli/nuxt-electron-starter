import { registerAppHandlers } from './appHandlers'
import { registerDialogHandlers } from './dialogHandlers'
import { registerShellHandlers } from './shellHandlers'
import { registerWindowHandlers } from './windowHandlers'

export function registerIpcHandlers(): void {
  registerAppHandlers()
  registerDialogHandlers()
  registerShellHandlers()
  registerWindowHandlers()
}
