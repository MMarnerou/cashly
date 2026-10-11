import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginForm } from './loginForm'
import { login } from '@/app/actions/auth'
import { demoUser } from '@/mocks/mockUsers'

vi.mock('@/app/actions/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.mocked(login).mockReset()
  })

  it('asks for an email and password', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('marks both fields as required', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeRequired()
    expect(screen.getByLabelText('Password')).toBeRequired()
  })

  it('has a sign-in button', () => {
    render(<LoginForm />)

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('shows the demo email in the hint', () => {
    render(<LoginForm />)

    expect(screen.getByText(/demo account/i)).toHaveTextContent(demoUser.email)
  })

  it('hides the password by default and toggles it visible with the eye button', () => {
    render(<LoginForm />)
    const password = screen.getByLabelText('Password')

    expect(password).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(password).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(password).toHaveAttribute('type', 'password')
  })

  it('shows no error message before signing in', () => {
    render(<LoginForm />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText(/enter your/i)).not.toBeInTheDocument()
  })

  it('asks for both fields when submitted empty, without contacting the server', async () => {
    render(<LoginForm />)

    submit()

    expect(await screen.findByText('Enter your email address.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true')
    expect(login).not.toHaveBeenCalled()
  })

  it('rejects an email address that is not valid', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    submit()

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('sends the email and password to the sign-in action when they are valid', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: demoUser.email } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: demoUser.password } })
    submit()

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1))
    const formData = vi.mocked(login).mock.calls[0][1] as FormData
    expect(formData.get('email')).toBe(demoUser.email)
    expect(formData.get('password')).toBe(demoUser.password)
    expect(screen.queryByText(/enter your/i)).not.toBeInTheDocument()
  })
})
