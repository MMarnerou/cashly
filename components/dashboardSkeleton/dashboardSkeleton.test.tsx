import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardSkeleton } from './dashboardSkeleton'

describe('DashboardSkeleton', () => {
  it('announces the loading state to screen readers', () => {
    render(<DashboardSkeleton />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading your transactions')).toBeInTheDocument()
  })

  it('renders placeholder rows for the transaction list', () => {
    const { container } = render(<DashboardSkeleton />)

    expect(container.querySelectorAll('.skeleton-row')).toHaveLength(5)
  })
})
