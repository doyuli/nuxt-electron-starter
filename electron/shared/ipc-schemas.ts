import type { FileFilter, OpenFileOptions, OpenFileProperty, SaveFileOptions } from './ipc-contract'
import { z } from 'zod'

const openFileProperties = [
  'openFile',
  'openDirectory',
  'multiSelections',
  'showHiddenFiles',
  'createDirectory',
  'promptToCreate',
  'noResolveAliases',
  'treatPackageAsDirectory',
  'dontAddToRecent',
] as const satisfies readonly [OpenFileProperty, ...OpenFileProperty[]]

const fileFilterSchema: z.ZodType<FileFilter> = z
  .object({
    name: z.string().trim().min(1),
    extensions: z.array(z.string().trim().min(1)).min(1),
  })
  .strict()

export const openFileOptionsSchema: z.ZodType<OpenFileOptions> = z
  .object({
    title: z.string().trim().min(1).optional(),
    defaultPath: z.string().min(1).optional(),
    buttonLabel: z.string().trim().min(1).optional(),
    filters: z.array(fileFilterSchema).min(1).optional(),
    properties: z.array(z.enum(openFileProperties)).min(1).optional(),
  })
  .strict()

export const saveFileOptionsSchema: z.ZodType<SaveFileOptions> = z
  .object({
    title: z.string().trim().min(1).optional(),
    defaultPath: z.string().min(1).optional(),
    buttonLabel: z.string().trim().min(1).optional(),
    filters: z.array(fileFilterSchema).min(1).optional(),
  })
  .strict()

function parseOptionalOptions<TOptions>(schema: z.ZodType<TOptions>, options: unknown): TOptions | undefined {
  return options === undefined ? undefined : schema.parse(options)
}

export function parseOpenFileOptions(options: unknown): OpenFileOptions | undefined {
  return parseOptionalOptions(openFileOptionsSchema, options)
}

export function parseSaveFileOptions(options: unknown): SaveFileOptions | undefined {
  return parseOptionalOptions(saveFileOptionsSchema, options)
}
