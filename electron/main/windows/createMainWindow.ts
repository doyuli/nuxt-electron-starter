import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow } from 'electron'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 800

export async function createMainWindow(): Promise<BrowserWindow> {
  const mainWindow = new BrowserWindow({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: '#f7f8fb',
    title: 'Nuxt Electron Starter',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  })

  mainWindow.setMenu(null)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    await mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }
  else {
    await mainWindow.loadFile(path.join(app.getAppPath(), '.output/public/index.html'))
  }

  return mainWindow
}
