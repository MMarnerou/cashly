import { jwtVerify, SignJWT } from 'jose'

export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Hardcoded for now. Anyone who can read this file can forge a session token,
// so move this to an environment variable before deploying anywhere shared.
const SECRET = 'development-only-secret'
const key = new TextEncoder().encode(SECRET)

export const createSession = async (email: string): Promise<string> => {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key)
}

/** Returns the signed-in email, or null if the token is missing, tampered with or expired. */
export const verifySession = async (value: string | undefined): Promise<string | null> => {
  if (!value) return null

  try {
    const { payload } = await jwtVerify(value, key, { algorithms: ['HS256'] })
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}
