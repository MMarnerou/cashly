import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AccountSummary } from './accountSummary'

describe('AccountSummary', () => {
  const account = { id: 'acc_000001', name: 'Maria Marnerou', currency: 'USD', balance: 428150 }

  it('shows the account name as the heading', () => {
    render(<AccountSummary account={account} />)

    expect(screen.getByRole('heading', { name: 'Maria Marnerou' })).toBeInTheDocument()
  })

  it('formats the balance in the account currency', () => {
    render(<AccountSummary account={account} />)

    expect(screen.getByText('$4,281.50')).toBeInTheDocument()
  })

  it('shows the currency code next to the balance label', () => {
    render(<AccountSummary account={account} />)

    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.getByText(/current balance in/i)).toBeInTheDocument()
  })
})
