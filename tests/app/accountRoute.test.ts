// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cookies } from 'next/headers'
import { GET } from '@/app/api/account/route'
import { demoUser } from '@/mocks/mockUsers'
import { mockAccount, mockTransactions } from '@/mocks/mockData'
import { createSession, SESSION_COOKIE } from '@/lib/session'

const { getAccountForEmail } = vi.hoisted(() => ({ getAccountForEmail: vi.fn() }))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('@/mocks/mockData', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/mocks/mockData')>()
  getAccountForEmail.mockImplementation(actual.getAccountForEmail)
  return { ...actual, getAccountForEmail }
})

const signedInAs = (value: string | undefined) => {
  vi.mocked(cookies).mockResolvedValue({
    get: (name: string) => (name === SESSION_COOKIE && value !== undefined ? { name, value } : undefined),
  } as Awaited<ReturnType<typeof cookies>>)
}

describe('GET /api/account', () => {
  beforeEach(() => {
    getAccountForEmail.mockClear()
  })

  // The route waits 700 ms to simulate latency. Fake timers don't work here because the
  // session check uses real async crypto, so the test waits for the real delay instead.
  const request = (url: string) => GET(new Request(url))

  it('returns 401 when there is no session cookie', async () => {
    signedInAs(undefined)

    const response = await request('http://localhost/api/account')

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ message: 'Not signed in' })
  })

  it('returns 401 when the session cookie has been tampered with', async () => {
    signedInAs('mmarnerou%40test.com.not-a-real-signature')

    const response = await request('http://localhost/api/account')

    expect(response.status).toBe(401)
  })

  it('returns the account and transactions for the signed-in user', async () => {
    signedInAs(await createSession(demoUser.email))

    const response = await request('http://localhost/api/account')

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.account).toEqual(mockAccount)
    expect(body.transactions).toEqual(mockTransactions)
  })

  it('returns no transactions for the empty scenario', async () => {
    signedInAs(await createSession(demoUser.email))

    const response = await request('http://localhost/api/account?scenario=empty')

    expect(response.status).toBe(200)
    expect((await response.json()).transactions).toEqual([])
  })

  it('returns 404 when the signed-in email has no account', async () => {
    signedInAs(await createSession('nobody@example.com'))
    getAccountForEmail.mockReturnValueOnce(undefined)

    const response = await request('http://localhost/api/account')

    expect(response.status).toBe(404)
    expect((await response.json()).message).toBe('No account found for this user.')
  })
})
