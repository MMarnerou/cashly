import { useEffect, useState } from 'react'
import type { Account, AccountResponse, Transaction } from '@/lib/types'

export type AccountState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; account: Account; transactions: Transaction[] }

/**
 * Loads the account and its transactions from the API.
 * Passes `?scenario=empty` through from the page URL so the empty state can be reached by hand.
 */
export const useAccount = () => {
  const [state, setState] = useState<AccountState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    const scenario = new URLSearchParams(window.location.search).get('scenario')
    const url = scenario ? `/api/account?scenario=${encodeURIComponent(scenario)}` : '/api/account'

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) {
          throw new Error(body.message ?? 'Request failed')
        }
        return body as AccountResponse
      })
      .then(({ account, transactions }) => {
        setState({ status: 'success', account, transactions })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Something went wrong.',
        })
      })

    return () => controller.abort()
  }, [])

  return { state }
}
