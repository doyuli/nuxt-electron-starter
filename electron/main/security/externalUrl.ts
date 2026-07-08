const ALLOWED_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:'])

export function assertSafeExternalUrl(value: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('External URL must be a non-empty string')
  }

  const url = new URL(value)
  if (!ALLOWED_EXTERNAL_PROTOCOLS.has(url.protocol)) {
    throw new Error(`External URL protocol is not allowed: ${url.protocol}`)
  }

  return url.toString()
}
