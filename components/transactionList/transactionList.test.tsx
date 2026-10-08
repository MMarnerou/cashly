import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TransactionList } from './transactionList'
import { TransactionType, type Transaction } from '@/lib/types'

const shell: Transaction = {
  id: 'txn_001',
  merchant: 'Shell',
  description: 'Fuel, pump 5',
  date: '2026-10-06T13:15:00Z',
  type: TransactionType.Debit,
  status: 'completed',
  amount: 5210,
  currency: 'USD',
  accountAmount: 5210,
}

const hotel: Transaction = {
  id: 'txn_002',
  merchant: 'Hôtel Lumière',
  description: 'Two nights, Paris',
  date: '2026-10-03T11:20:00Z',
  type: TransactionType.Debit,
  status: 'declined',
  amount: 24000,
  currency: 'EUR',
  accountAmount: 26136,
}

describe('TransactionList', () => {
  it('shows an empty state when the account has no transactions', () => {
    render(
      <TransactionList
        transactions={[]}
        totalCount={0}
        accountCurrency="USD"
        onSelect={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    )

    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
  })

  it('shows a no-results state with a clear button when filters match nothing', () => {
    const onClearFilters = vi.fn()
    render(
      <TransactionList
        transactions={[]}
        totalCount={2}
        accountCurrency="USD"
        onSelect={vi.fn()}
        onClearFilters={onClearFilters}
      />,
    )

    expect(screen.getByText('No transactions match your filters')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onClearFilters).toHaveBeenCalledTimes(1)
  })

  it('shows how many transactions are visible', () => {
    render(
      <TransactionList
        transactions={[shell]}
        totalCount={2}
        accountCurrency="USD"
        onSelect={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    )

    expect(screen.getByText('Showing 1 of 2')).toBeInTheDocument()
  })

  it('shows each transaction with its merchant and status', () => {
    render(
      <TransactionList
        transactions={[shell, hotel]}
        totalCount={2}
        accountCurrency="USD"
        onSelect={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /Shell, -\$52\.10, completed/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hôtel Lumière, -€240\.00, declined/ })).toBeInTheDocument()
  })

  it('calls onSelect with the transaction that was clicked', () => {
    const onSelect = vi.fn()
    render(
      <TransactionList
        transactions={[shell]}
        totalCount={1}
        accountCurrency="USD"
        onSelect={onSelect}
        onClearFilters={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Shell/ }))

    expect(onSelect).toHaveBeenCalledWith(shell)
  })

  it('shows the account-currency equivalent for foreign transactions only', () => {
    render(
      <TransactionList
        transactions={[shell, hotel]}
        totalCount={2}
        accountCurrency="USD"
        onSelect={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    )

    expect(screen.getByText('≈ -$261.36')).toBeInTheDocument()
    expect(screen.getAllByText(/≈/)).toHaveLength(1)
  })
})
