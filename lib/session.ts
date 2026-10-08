export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Set SESSION_SECRET in .env for anything beyond local demos.
// `||` rather than `??` so an empty SESSION_SECRET= line in .env also falls back.
const SECRET = process.env.SESSION_SECRET || 'development-only-secret'
const encoder = new TextEncoder()

const getKey = () => {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

const toHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const fromHex = (hex: string): Uint8Array<ArrayBuffer> => {
  const bytes = new Uint8Array(new ArrayBuffer(hex.length / 2))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

export const createSession = async (email: string): Promise<string> => {
  const signature = await crypto.subtle.sign('HMAC', await getKey(), encoder.encode(email))
  return `${encodeURIComponent(email)}.${toHex(signature)}`
}

/** Returns the signed-in email, or null if the cookie is missing or tampered with. */
export const verifySession = async (value: string | undefined): Promise<string | null> => {
  if (!value) return null

  const separator = value.lastIndexOf('.')
  if (separator === -1) return null

  const signature = value.slice(separator + 1)
  if (!/^[0-9a-f]+$/.test(signature)) return null

  let email: string
  try {
    email = decodeURIComponent(value.slice(0, separator))
  } catch {
    return null
  }

  const valid = await crypto.subtle.verify(
    'HMAC',
    await getKey(),
    fromHex(signature),
    encoder.encode(email),
  )
  return valid ? email : null
}
