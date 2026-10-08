import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BottomNav } from './bottomNav'

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}))

vi.mock('@/app/actions/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

describe('BottomNav', () => {
  beforeEach(() => {
    usePathnameMock.mockReset()
  })

  it('has icon links to transactions and profile, each with a text name', () => {
    usePathnameMock.mockReturnValue('/')
    render(<BottomNav />)

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile')
  })

  it('has an icon-only sign out button', () => {
    usePathnameMock.mockReturnValue('/')
    render(<BottomNav />)

    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
  })

  it('marks the transactions link as the current page on /', () => {
    usePathnameMock.mockReturnValue('/')
    render(<BottomNav />)

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Profile' })).not.toHaveAttribute('aria-current')
  })

  it('marks the profile link as the current page on /profile', () => {
    usePathnameMock.mockReturnValue('/profile')
    render(<BottomNav />)

    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders each icon as decorative, so the label comes from aria-label', () => {
    usePathnameMock.mockReturnValue('/')
    const { container } = render(<BottomNav />)

    const icons = container.querySelectorAll('svg.bottom-nav__icon')
    expect(icons).toHaveLength(3)
    icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'))
  })
})
