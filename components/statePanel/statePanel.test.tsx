import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatePanel } from './statePanel'

describe('StatePanel', () => {
  it('shows the title and description', () => {
    render(<StatePanel title="No transactions yet" description="Check back later." />)

    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
    expect(screen.getByText('Check back later.')).toBeInTheDocument()
  })

  it('announces error panels to screen readers', () => {
    render(<StatePanel tone="error" title="Something went wrong" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })

  it('does not use the alert role for neutral panels', () => {
    render(<StatePanel title="Empty" />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the icon and action when given', () => {
    render(
      <StatePanel
        title="Oops"
        icon={<span data-testid="icon" />}
        action={<button type="button">Try again</button>}
      />,
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('omits the description when not given', () => {
    const { container } = render(<StatePanel title="Only a title" />)

    expect(container.querySelector('.state-panel__description')).toBeNull()
  })
})
