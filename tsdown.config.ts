import { defineConfig } from 'tsdown'

const shared = {
  format: 'cjs',
  target: 'es2020',
  deps: {
    neverBundle: ['electron'],
  },
}

export default defineConfig([
  {
    ...shared,
    entry: {
      'main/index': 'electron/main/index.ts',
    },
    clean: true,
  },
  {
    ...shared,
    entry: {
      'preload/index': 'electron/preload/index.ts',
    },
    clean: false,
    outputOptions: {
      codeSplitting: false,
    },
  },
])
