import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from './statusBadge'

describe('StatusBadge', () => {
  it.each([
    ['completed', 'Completed'],
    ['pending', 'Pending'],
    ['declined', 'Declined'],
  ] as const)('shows the label for %s', (status, label) => {
    render(<StatusBadge status={status} />)

    expect(screen.getByText(label)).toHaveClass(`status-badge--${status}`)
  })
})
