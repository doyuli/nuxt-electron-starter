# Electron Nuxt Starter

A lightweight Electron + Nuxt + TypeScript starter.

## Stack

- Electron desktop shell
- Nuxt renderer built to static Nitro output
- Shadcn UI
- TypeScript throughout main, preload, shared contracts, and renderer
- Typed preload IPC bridge
- electron-builder packaging

## Security Defaults

- `nodeIntegration: false`
- `contextIsolation: true`
- No `@electron/remote`
- Renderer code does not import Electron
- Desktop APIs are exposed through `window.electronAPI`
- External URLs are restricted to `http:` and `https:`

## Commands

```bash
pnpm install
pnpm dev
pnpm build
```

If Electron binary downloads are slow in your environment, run install with an Electron mirror:

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ pnpm install
```

## Project Layout

```text
electron/main       Electron main process
electron/preload    contextBridge API
electron/shared     IPC contracts and shared types
app                 Nuxt renderer application
```

## IPC Pattern

Renderer code calls the typed preload bridge:

```ts
const version = await window.electronAPI.app.getVersion()
```

The preload bridge forwards requests to named IPC channels. The main process owns all Node and Electron capabilities.
