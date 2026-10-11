// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { login, logout } from '@/app/actions/auth'
import { demoUser } from '@/mocks/mockUsers'
import { SESSION_COOKIE, SESSION_MAX_AGE, verifySession } from '@/lib/session'

const { cookieStore } = vi.hoisted(() => ({
  cookieStore: { set: vi.fn(), delete: vi.fn() },
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStore),
}))

// Next.js implements redirect() by throwing an error whose digest records the destination.
vi.mock('next/navigation', () => ({
  redirect: vi.fn((destination: string) => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: `NEXT_REDIRECT;replace;${destination};307;` })
  }),
}))

const formWith = (fields: Record<string, string>) => {
  const formData = new FormData()
  Object.entries(fields).forEach(([name, value]) => formData.set(name, value))
  return formData
}

describe('login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('asks for both email and password when either is missing', async () => {
    const result = await login(undefined, formWith({ email: '  ', password: 'x' }))

    expect(result).toEqual({ error: 'Enter your email and password.', email: '' })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('rejects a wrong password and keeps the email for the form', async () => {
    const result = await login(undefined, formWith({ email: demoUser.email, password: 'wrong' }))

    expect(result).toEqual({ error: 'Invalid email or password.', email: demoUser.email })
    expect(cookieStore.set).not.toHaveBeenCalled()
  })

  it('rejects an unknown email', async () => {
    const result = await login(undefined, formWith({ email: 'someone@else.com', password: demoUser.password }))

    expect(result?.error).toBe('Invalid email or password.')
  })

  it('signs in with the demo account, ignoring email case and surrounding spaces', async () => {
    await expect(
      login(undefined, formWith({ email: `  ${demoUser.email.toUpperCase()} `, password: demoUser.password })),
    ).rejects.toMatchObject({ digest: 'NEXT_REDIRECT;replace;/;307;' })

    expect(cookieStore.set).toHaveBeenCalledTimes(1)
    const [name, value, options] = cookieStore.set.mock.calls[0]
    expect(name).toBe(SESSION_COOKIE)
    expect(await verifySession(value)).toBe(demoUser.email)
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })
    expect(redirect).toHaveBeenCalledWith('/')
  })
})

describe('logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('removes the session cookie and sends the user to sign-in', async () => {
    await expect(logout()).rejects.toMatchObject({ digest: 'NEXT_REDIRECT;replace;/login;307;' })

    expect(cookies).toHaveBeenCalled()
    expect(cookieStore.delete).toHaveBeenCalledWith(SESSION_COOKIE)
    expect(redirect).toHaveBeenCalledWith('/login')
  })
})
