import { describe, expect, it } from 'vitest'
import { parseOpenFileOptions, parseSaveFileOptions } from './ipc-schemas'

describe('iPC option schemas', () => {
  it('accepts valid open file dialog options', () => {
    expect(
      parseOpenFileOptions({
        title: 'Open project',
        filters: [{ name: 'Images', extensions: ['png', 'jpg'] }],
        properties: ['openFile', 'multiSelections'],
      }),
    ).toEqual({
      title: 'Open project',
      filters: [{ name: 'Images', extensions: ['png', 'jpg'] }],
      properties: ['openFile', 'multiSelections'],
    })
  })

  it('treats omitted options as undefined', () => {
    expect(parseOpenFileOptions(undefined)).toBeUndefined()
    expect(parseSaveFileOptions(undefined)).toBeUndefined()
  })

  it('rejects unknown option keys', () => {
    expect(() => parseSaveFileOptions({ title: 'Save', unsafe: true })).toThrow()
  })

  it('rejects invalid open file properties', () => {
    expect(() => parseOpenFileOptions({ properties: ['openAnything'] })).toThrow()
  })
})
