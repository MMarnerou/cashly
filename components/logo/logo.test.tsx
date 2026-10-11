import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './logo'

describe('Logo', () => {
  it('renders a decorative SVG hidden from screen readers', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses the logo class by default', () => {
    const { container } = render(<Logo />)

    expect(container.querySelector('svg')).toHaveClass('logo')
  })

  it('accepts a custom class name', () => {
    const { container } = render(<Logo className="logo-mark logo-mark--lg" />)

    expect(container.querySelector('svg')).toHaveClass('logo-mark', 'logo-mark--lg')
  })
})
