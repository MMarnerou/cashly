import { cookies } from 'next/headers'
import { getAccountForEmail } from '@/mocks/mockData'
import { SESSION_COOKIE, verifySession } from '@/lib/session'
import type { AccountResponse } from '@/lib/types'

const SIMULATED_LATENCY_MS = 700

// Returns the account and transactions belonging to the signed-in user.
// `?scenario=empty` and `?scenario=error` exist so the UI states can be checked by hand.
export const GET = async (request: Request) => {
  const scenario = new URL(request.url).searchParams.get('scenario')

  const cookieStore = await cookies()
  const email = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)
  if (!email) {
    return Response.json({ message: 'Not signed in' }, { status: 401 })
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS))

  if (scenario === 'error') {
    return Response.json(
      { message: 'We could not load your account. Please try again.' },
      { status: 500 },
    )
  }

  const userData = getAccountForEmail(email)
  if (!userData) {
    return Response.json({ message: 'No account found for this user.' }, { status: 404 })
  }

  const body: AccountResponse = {
    account: userData.account,
    transactions: scenario === 'empty' ? [] : userData.transactions,
  }

  return Response.json(body)
}
