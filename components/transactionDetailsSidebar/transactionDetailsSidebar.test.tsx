import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TransactionDetailsSidebar } from './transactionDetailsSidebar'
import { TransactionType, type Transaction } from '@/lib/types'

const pendingCoffee: Transaction = {
  id: 'txn_011',
  merchant: 'Starbucks',
  description: 'Coffee and croissant',
  date: '2026-10-08T07:58:00Z',
  type: TransactionType.Debit,
  status: 'pending',
  amount: 675,
  currency: 'USD',
  accountAmount: 675,
}

const foreignSalary: Transaction = {
  id: 'txn_020',
  merchant: 'Acme Corp Payroll',
  description: 'Salary',
  date: '2026-10-06T09:00:00Z',
  type: TransactionType.Credit,
  status: 'completed',
  amount: 100000,
  currency: 'EUR',
  accountAmount: 108000,
}

describe('TransactionDetailsSidebar', () => {
  it('shows nothing when no transaction is selected', () => {
    render(<TransactionDetailsSidebar transaction={null} accountCurrency="USD" onClose={vi.fn()} />)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('opens and shows the merchant, amount and reference of the selected transaction', () => {
    render(<TransactionDetailsSidebar transaction={pendingCoffee} accountCurrency="USD" onClose={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Starbucks' })).toBeInTheDocument()
    expect(screen.getByText('-$6.75')).toBeInTheDocument()
    expect(screen.getByText('txn_011')).toBeInTheDocument()
  })

  it('explains that a pending amount may change', () => {
    render(<TransactionDetailsSidebar transaction={pendingCoffee} accountCurrency="USD" onClose={vi.fn()} />)

    expect(screen.getByText(/pending and the amount may change/i)).toBeInTheDocument()
  })

  it('shows a plus sign on credits', () => {
    render(<TransactionDetailsSidebar transaction={foreignSalary} accountCurrency="USD" onClose={vi.fn()} />)

    expect(screen.getByText('+€1,000.00')).toBeInTheDocument()
  })

  it('shows the account-currency amount for foreign transactions', () => {
    render(<TransactionDetailsSidebar transaction={foreignSalary} accountCurrency="USD" onClose={vi.fn()} />)

    expect(screen.getByText('In USD')).toBeInTheDocument()
    expect(screen.getByText('+$1,080.00')).toBeInTheDocument()
  })

  it('labels the reference as the transaction reference', () => {
    render(<TransactionDetailsSidebar transaction={pendingCoffee} accountCurrency="USD" onClose={vi.fn()} />)

    expect(screen.getByText('Transaction reference')).toBeInTheDocument()
  })

  it('copies the transaction reference', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<TransactionDetailsSidebar transaction={pendingCoffee} accountCurrency="USD" onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy transaction reference' }))

    expect(await screen.findByText('Copied')).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledWith('txn_011')
  })

  it('calls onClose from the close button', () => {
    const onClose = vi.fn()
    render(<TransactionDetailsSidebar transaction={pendingCoffee} accountCurrency="USD" onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: 'Close transaction details' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
