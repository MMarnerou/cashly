import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LogoMark } from './logo'

describe('LogoMark', () => {
  it('renders a decorative SVG hidden from screen readers', () => {
    const { container } = render(<LogoMark />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32')
  })

  it('uses the logo class by default', () => {
    const { container } = render(<LogoMark />)

    expect(container.querySelector('svg')).toHaveClass('logo-mark')
  })

  it('accepts a custom class name', () => {
    const { container } = render(<LogoMark className="logo-mark logo-mark--lg" />)

    expect(container.querySelector('svg')).toHaveClass('logo-mark', 'logo-mark--lg')
  })
})
