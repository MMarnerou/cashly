import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TransactionDashboard } from './transactionDashboard'
import { TransactionType, type Transaction } from '@/lib/types'

const { useAccountMock, replaceMock } = vi.hoisted(() => ({
  useAccountMock: vi.fn(),
  replaceMock: vi.fn(),
}))

vi.mock('@/hooks/useAccount', () => ({
  useAccount: useAccountMock,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}))

const account = { id: 'acc_000001', name: 'Maria Marnerou', currency: 'USD', balance: 428150 }

const transactions: Transaction[] = [
  {
    id: 'txn_001',
    merchant: 'Whole Foods Market',
    description: 'Weekly grocery shop',
    date: '2026-10-07T18:42:00Z',
    type: TransactionType.Debit,
    status: 'completed',
    amount: 8745,
    currency: 'USD',
    accountAmount: 8745,
  },
  {
    id: 'txn_002',
    merchant: 'Acme Corp Payroll',
    description: 'Salary',
    date: '2026-10-06T09:00:00Z',
    type: TransactionType.Credit,
    status: 'completed',
    amount: 310000,
    currency: 'USD',
    accountAmount: 310000,
  },
]

describe('TransactionDashboard', () => {
  beforeEach(() => {
    useAccountMock.mockReset()
    replaceMock.mockReset()
  })

  it('shows the loading skeleton while the account loads', () => {
    useAccountMock.mockReturnValue({ state: { status: 'loading' } })

    render(<TransactionDashboard />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading your transactions')
  })

  it('sends the visitor to the error page when the account fails to load', () => {
    useAccountMock.mockReturnValue({
      state: { status: 'error', message: 'We could not load your account.' },
    })

    const { container } = render(<TransactionDashboard />)

    expect(replaceMock).toHaveBeenCalledWith('/error')
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the account summary, filters and transactions when loaded', () => {
    useAccountMock.mockReturnValue({
      state: { status: 'success', account, transactions },
    })

    render(<TransactionDashboard />)

    expect(screen.getByRole('heading', { name: 'Maria Marnerou' })).toBeInTheDocument()
    expect(screen.getByRole('search', { name: 'Filter transactions' })).toBeInTheDocument()
    expect(screen.getByText('Showing 2 of 2')).toBeInTheDocument()
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('filters the list when a merchant is searched', () => {
    useAccountMock.mockReturnValue({
      state: { status: 'success', account, transactions },
    })

    render(<TransactionDashboard />)
    fireEvent.change(screen.getByPlaceholderText('Search merchants'), { target: { value: 'whole' } })

    expect(screen.getByText('Showing 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Whole Foods Market/ })).toBeInTheDocument()
  })

  it('opens the details sidebar when a transaction is clicked', () => {
    useAccountMock.mockReturnValue({
      state: { status: 'success', account, transactions },
    })

    render(<TransactionDashboard />)
    fireEvent.click(screen.getByRole('button', { name: /Whole Foods Market/ }))

    expect(screen.getByRole('heading', { name: 'Whole Foods Market' })).toBeInTheDocument()
    expect(screen.getByText('txn_001')).toBeInTheDocument()
  })

  it('hides the filters when the account has no transactions', () => {
    useAccountMock.mockReturnValue({
      state: { status: 'success', account, transactions: [] },
    })

    render(<TransactionDashboard />)

    expect(screen.queryByRole('search')).not.toBeInTheDocument()
    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
  })
})
