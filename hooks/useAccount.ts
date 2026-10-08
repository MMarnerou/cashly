import { useCallback, useEffect, useState } from 'react'
import type { Account, AccountResponse, Transaction } from '@/lib/types'

export type AccountState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; account: Account; transactions: Transaction[] }

/**
 * Loads the account and its transactions from the API.
 * Passes `?scenario=` through from the page URL so the empty and error states can be reached by hand.
 */
export const useAccount = () => {
  const [state, setState] = useState<AccountState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

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
  }, [attempt])

  // Retrying leaves any test scenario, so the request goes back to the normal data.
  const retry = useCallback(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.has('scenario')) {
      url.searchParams.delete('scenario')
      window.history.replaceState(null, '', url.pathname + url.search + url.hash)
    }

    setState({ status: 'loading' })
    setAttempt((count) => count + 1)
  }, [])

  return { state, retry }
}
