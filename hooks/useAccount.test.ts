import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAccount, mockTransactions } from '@/mocks/mockData'
import { useAccount } from './useAccount'

const jsonResponse = (body: unknown, status = 200) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response

const successBody = { account: mockAccount, transactions: mockTransactions }

const setUrl = (path: string) => window.history.replaceState(null, '', path)

describe('useAccount', () => {
  beforeEach(() => {
    setUrl('/')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    setUrl('/')
  })

  it('starts loading, then holds the account and transactions', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(successBody))

    const { result } = renderHook(() => useAccount())
    expect(result.current.state).toEqual({ status: 'loading' })

    await waitFor(() => expect(result.current.state.status).toBe('success'))
    expect(result.current.state).toEqual({
      status: 'success',
      account: mockAccount,
      transactions: mockTransactions,
    })
    expect(fetch).toHaveBeenCalledWith('/api/account', expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  it('passes the scenario from the page URL to the API', async () => {
    setUrl('/?scenario=empty')
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ account: mockAccount, transactions: [] }))

    const { result } = renderHook(() => useAccount())

    await waitFor(() => expect(result.current.state.status).toBe('success'))
    expect(fetch).toHaveBeenCalledWith('/api/account?scenario=empty', expect.anything())
  })

  it('shows the API message when the request fails', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ message: 'Server exploded' }, 500))

    const { result } = renderHook(() => useAccount())

    await waitFor(() => expect(result.current.state).toEqual({ status: 'error', message: 'Server exploded' }))
  })

  it('uses a generic message when a failed response has none', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 500))

    const { result } = renderHook(() => useAccount())

    await waitFor(() => expect(result.current.state).toEqual({ status: 'error', message: 'Request failed' }))
  })

  it('shows the network error message when the request cannot be sent', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network down'))

    const { result } = renderHook(() => useAccount())

    await waitFor(() => expect(result.current.state).toEqual({ status: 'error', message: 'Network down' }))
  })

  it('falls back to a generic message for errors that are not Error objects', async () => {
    vi.mocked(fetch).mockRejectedValue('not an error')

    const { result } = renderHook(() => useAccount())

    await waitFor(() =>
      expect(result.current.state).toEqual({ status: 'error', message: 'Something went wrong.' }),
    )
  })

  it('cancels the pending request on unmount without reporting an error', async () => {
    vi.mocked(fetch).mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        }),
    )

    const { result, unmount } = renderHook(() => useAccount())
    const signal = vi.mocked(fetch).mock.calls[0][1]?.signal

    unmount()
    await act(() => Promise.resolve())

    expect(signal?.aborted).toBe(true)
    expect(result.current.state).toEqual({ status: 'loading' })
  })
})
