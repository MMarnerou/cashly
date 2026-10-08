import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AppLayout from '@/app/(dashboard)/layout'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/app/actions/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

describe('Dashboard layout', () => {
  it('shows the page content', () => {
    render(<AppLayout><p>Page content</p></AppLayout>)

    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('shows the site header', () => {
    render(<AppLayout><p>Page content</p></AppLayout>)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('shows the header and bottom navigation', () => {
    render(<AppLayout><p>Page content</p></AppLayout>)

    expect(screen.getAllByRole('navigation', { name: 'Main' })).toHaveLength(2)
  })
})
