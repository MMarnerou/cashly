'use client'

import { startTransition, useActionState, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { login } from '@/app/actions/auth'
import EyeIcon from '@/assets/icons/eye.svg'
import EyeOffIcon from '@/assets/icons/eye-off.svg'
import { Alert } from '../alert'
import { demoUser } from '@/mocks/mockUsers'
import './loginForm.css'

// Checks the fields before anything is sent. The server action checks the credentials again.
const loginSchema = Yup.object({
  email: Yup.string().trim().email('Enter a valid email address.').required('Enter your email address.'),
  password: Yup.string().required('Enter your password.'),
})

export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(login, undefined)
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const formData = new FormData()
      formData.set('email', values.email)
      formData.set('password', values.password)
      startTransition(() => formAction(formData))
    },
  })

  const emailError = formik.touched.email ? formik.errors.email : undefined
  const passwordError = formik.touched.password ? formik.errors.password : undefined

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="card card--padded login-form">
      <div className="field field--lg">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'login-email-error' : undefined}
          className="input input--lg"
        />
        {emailError && (
          <p id="login-email-error" className="field__error">
            {emailError}
          </p>
        )}
      </div>

      <div className="field field--lg">
        <label htmlFor="login-password">Password</label>
        <div className="password-field">
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? 'login-password-error' : undefined}
            className="input input--lg password-field__input"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="password-field__toggle"
          >
            {showPassword ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
          </button>
        </div>
        {passwordError && (
          <p id="login-password-error" className="field__error">
            {passwordError}
          </p>
        )}
      </div>

      {state?.error && <Alert tone="error">{state.error}</Alert>}

      <button type="submit" disabled={isPending} className="button button--primary button--block">
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="login-form__hint">
        Demo account: <code>{demoUser.email}</code> / <code>{demoUser.password}</code>
      </p>
    </form>
  )
}
