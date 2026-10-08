import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from '@/app/login/page'

vi.mock('@/app/actions/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

describe('Login page', () => {
  it('shows the sign-in heading', () => {
    render(<LoginPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Sign in to Cashly' })).toBeInTheDocument()
  })

  it('shows the sign-in form', () => {
    render(<LoginPage />)

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('does not show the signed-in navigation', () => {
    render(<LoginPage />)

    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument()
  })
})
