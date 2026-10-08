import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './loginForm'
import { demoUser } from '@/mocks/mockUsers'

vi.mock('@/app/actions/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

describe('LoginForm', () => {
  it('asks for an email and password', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password')
  })

  it('marks both fields as required', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeRequired()
    expect(screen.getByLabelText(/password/i)).toBeRequired()
  })

  it('has a sign-in button', () => {
    render(<LoginForm />)

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('shows the demo email in the hint', () => {
    render(<LoginForm />)

    expect(screen.getByText(/demo account/i)).toHaveTextContent(demoUser.email)
  })

  it('shows no error message before signing in', () => {
    render(<LoginForm />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
