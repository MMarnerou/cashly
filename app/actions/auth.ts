'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { demoUser } from '@/mocks/mockUsers'
import { createSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session'

export type LoginState = { error?: string; email?: string } | undefined

export const login = async (_previous: LoginState, formData: FormData): Promise<LoginState> => {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Enter your email and password.', email }
  }

  if (email.toLowerCase() !== demoUser.email || password !== demoUser.password) {
    return { error: 'Invalid email or password.', email }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSession(demoUser.email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  redirect('/')
}

export const logout = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/login')
}
