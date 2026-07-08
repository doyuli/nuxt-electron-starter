import { contextBridge } from 'electron'
import { electronAPI } from './electron-api'

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
