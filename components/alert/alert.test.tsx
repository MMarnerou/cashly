import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Alert } from './alert'

describe('Alert', () => {
  it('renders its message', () => {
    render(<Alert>Saved</Alert>)

    expect(screen.getByText('Saved')).toBeInTheDocument()
  })

  it('announces error messages to screen readers', () => {
    render(<Alert tone="error">Invalid email or password.</Alert>)

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password.')
  })

  it('does not use the alert role for non-error tones', () => {
    render(<Alert tone="success">Done</Alert>)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('applies the class for the chosen tone', () => {
    render(<Alert tone="success">Done</Alert>)

    expect(screen.getByText('Done')).toHaveClass('alert', 'alert--success')
  })

  it('defaults to the info tone', () => {
    render(<Alert>Note</Alert>)

    expect(screen.getByText('Note')).toHaveClass('alert--info')
  })
})
