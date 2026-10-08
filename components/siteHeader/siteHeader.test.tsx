import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SiteHeader } from './siteHeader'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/app/actions/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

describe('SiteHeader', () => {
  it('shows the Cashly brand and links it to the dashboard', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: /cashly/i })).toHaveAttribute('href', '/')
  })

  it('has the main navigation with the page links', () => {
    render(<SiteHeader />)

    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toContainElement(screen.getByRole('link', { name: 'Transactions' }))
    expect(nav).toContainElement(screen.getByRole('link', { name: 'Profile' }))
  })

  it('has a sign out button', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
  })
})
