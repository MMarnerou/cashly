'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { Alert } from '../alert'
import { demoUser } from '@/mocks/mockUsers';

export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(login, undefined)

  return (
    <form action={formAction} className="card card--padded login-form">
      <label className="field field--lg">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.email}
          className="input input--lg"
        />
      </label>

      <label className="field field--lg">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input input--lg"
        />
      </label>

      {state?.error && <Alert tone="error">{state.error}</Alert>}

      <button type="submit" disabled={isPending} className="button button--primary button--block">
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="login-form__hint">
        Demo account: `${demoUser.email}` / `{demoUser.password}`
      </p>
    </form>
  )
}
