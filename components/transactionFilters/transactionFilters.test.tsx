import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TransactionFilters } from './transactionFilters'
import { DEFAULT_FILTERS } from '@/lib/transactions'

const renderFilters = (overrides: Partial<typeof DEFAULT_FILTERS> = {}, isFiltered = false) => {
  const onChange = vi.fn()
  const onReset = vi.fn()

  render(
    <TransactionFilters
      filters={{ ...DEFAULT_FILTERS, ...overrides }}
      isFiltered={isFiltered}
      onChange={onChange}
      onReset={onReset}
    />,
  )

  return { onChange, onReset }
}

describe('TransactionFilters', () => {
  it('has a labelled search region', () => {
    renderFilters()

    expect(screen.getByRole('search', { name: 'Filter transactions' })).toBeInTheDocument()
  })

  it('reports merchant search changes', () => {
    const { onChange } = renderFilters()

    fireEvent.change(screen.getByPlaceholderText('Search merchants'), { target: { value: 'Shell' } })

    expect(onChange).toHaveBeenCalledWith({ merchant: 'Shell' })
  })

  it('reports status changes', () => {
    const { onChange } = renderFilters()

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'pending' } })

    expect(onChange).toHaveBeenCalledWith({ status: 'pending' })
  })

  it('reports type changes', () => {
    const { onChange } = renderFilters()

    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'credit' } })

    expect(onChange).toHaveBeenCalledWith({ type: 'credit' })
  })

  it('reports sort changes', () => {
    const { onChange } = renderFilters()

    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'amount-asc' } })

    expect(onChange).toHaveBeenCalledWith({ sort: 'amount-asc' })
  })

  it('disables Clear filters when nothing is filtered', () => {
    renderFilters({}, false)

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled()
  })

  it('resets the filters when Clear filters is clicked', () => {
    const { onReset } = renderFilters({ merchant: 'Shell' }, true)

    const button = screen.getByRole('button', { name: 'Clear filters' })
    expect(button).toBeEnabled()
    fireEvent.click(button)

    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
