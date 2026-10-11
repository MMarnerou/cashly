import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProfileDetails, ProfileSkeleton } from './profileDetails'
import { demoUser } from '@/mocks/mockUsers'

const { verifySessionMock, redirectMock } = vi.hoisted(() => ({
  verifySessionMock: vi.fn(),
  // redirect() throws an error whose digest records the destination, as Next.js does.
  redirectMock: vi.fn((destination: string) => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: `NEXT_REDIRECT;replace;${destination};307;` })
  }),
}))

vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => ({ value: 'signed-cookie' }) }),
}))

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}))

vi.mock('@/lib/session', () => ({
  SESSION_COOKIE: 'session',
  verifySession: verifySessionMock,
}))

describe('ProfileDetails', () => {
  beforeEach(() => {
    verifySessionMock.mockReset()
    redirectMock.mockClear()
  })

  it('shows the signed-in user details when the session is valid', async () => {
    verifySessionMock.mockResolvedValue(demoUser.email)

    render(await ProfileDetails())

    expect(screen.getByRole('heading', { level: 1, name: demoUser.name })).toBeInTheDocument()
    expect(screen.getByText(demoUser.email, { selector: 'dd' })).toBeInTheDocument()
  })

  it('shows the account name, ID and currency', async () => {
    verifySessionMock.mockResolvedValue(demoUser.email)

    render(await ProfileDetails())

    expect(screen.getByText('acc_000001')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy account ID' })).toBeInTheDocument()
  })

  it('redirects to sign-in when the session is not valid', async () => {
    verifySessionMock.mockResolvedValue(null)

    await expect(ProfileDetails()).rejects.toMatchObject({ digest: 'NEXT_REDIRECT;replace;/login;307;' })
    expect(redirectMock).toHaveBeenCalledWith('/login')
  })
})

describe('ProfileSkeleton', () => {
  it('announces the loading state', () => {
    render(<ProfileSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading your profile')
  })
})
