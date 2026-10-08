import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProfilePage from '@/app/(dashboard)/profile/page'

// ProfileDetails is an async server component, so it can't render in jsdom.
// Its content is covered by the ProfileDetails tests. These tests cover the page shell.

vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => ({ value: 'signed-cookie' }) }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/session', () => ({
  SESSION_COOKIE: 'session',
  verifySession: vi.fn(),
}))

describe('Profile page', () => {
  it('puts the profile inside the main landmark', () => {
    render(<ProfilePage />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('shows the loading state while the profile is fetched', () => {
    render(<ProfilePage />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading your profile')
  })
})
