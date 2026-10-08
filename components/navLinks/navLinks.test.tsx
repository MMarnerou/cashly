import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NavLinks } from './navLinks'

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}))

const renderInList = () => {
  return render(
    <ul>
      <NavLinks />
    </ul>,
  )
}

describe('NavLinks', () => {
  beforeEach(() => {
    usePathnameMock.mockReset()
  })

  it('links to the transactions and profile pages', () => {
    usePathnameMock.mockReturnValue('/')
    renderInList()

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile')
  })

  it('marks the transactions link as the current page on /', () => {
    usePathnameMock.mockReturnValue('/')
    renderInList()

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Profile' })).not.toHaveAttribute('aria-current')
  })

  it('marks the profile link as the current page on /profile', () => {
    usePathnameMock.mockReturnValue('/profile')
    renderInList()

    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Transactions' })).not.toHaveAttribute('aria-current')
  })
})
