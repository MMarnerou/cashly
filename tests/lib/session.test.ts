// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { SignJWT } from 'jose'
import { createSession, verifySession } from '@/lib/session'

const signWith = (secret: string, subject: string, expires: number | string) =>
  new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(subject)
    .setExpirationTime(expires)
    .sign(new TextEncoder().encode(secret))

describe('session', () => {
  it('returns the email from a token it created', async () => {
    const token = await createSession('demo@example.com')
    expect(await verifySession(token)).toBe('demo@example.com')
  })

  it('rejects a token signed with a different secret', async () => {
    const forged = await signWith('wrong-secret', 'demo@example.com', '1h')
    expect(await verifySession(forged)).toBeNull()
  })

  it('rejects a token whose payload was changed', async () => {
    const token = await createSession('demo@example.com')
    const [header, , signature] = token.split('.')
    const other = await createSession('other@example.com')
    const otherPayload = other.split('.')[1]
    expect(await verifySession(`${header}.${otherPayload}.${signature}`)).toBeNull()
  })

  it('rejects an expired token', async () => {
    const expired = await signWith('development-only-secret', 'demo@example.com', Math.floor(Date.now() / 1000) - 10)
    expect(await verifySession(expired)).toBeNull()
  })

  it('rejects a missing or malformed token', async () => {
    expect(await verifySession(undefined)).toBeNull()
    expect(await verifySession('')).toBeNull()
    expect(await verifySession('not-a-jwt')).toBeNull()
  })
})
