import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Home from '@/app/(dashboard)/page'

vi.mock('@/components/transactionDashboard', () => ({
  TransactionDashboard: () => <div data-testid="transaction-dashboard" />,
}))

describe('Dashboard page', () => {
  it('renders the transaction dashboard inside the main landmark', () => {
    render(<Home />)

    expect(screen.getByRole('main')).toContainElement(screen.getByTestId('transaction-dashboard'))
  })
})
