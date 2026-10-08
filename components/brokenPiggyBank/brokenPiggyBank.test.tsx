import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrokenPiggyBank } from './brokenPiggyBank'

describe('BrokenPiggyBank', () => {
  it('renders a decorative SVG hidden from screen readers', () => {
    const { container } = render(<BrokenPiggyBank />)
    const svg = container.querySelector('svg')

    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses the state panel icon class by default', () => {
    const { container } = render(<BrokenPiggyBank />)

    expect(container.querySelector('svg')).toHaveClass('state-panel__icon')
  })

  it('accepts a custom class name', () => {
    const { container } = render(<BrokenPiggyBank className="custom" />)

    expect(container.querySelector('svg')).toHaveClass('custom')
  })
})
