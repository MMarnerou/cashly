import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ErrorPage from '@/app/(dashboard)/error/page'

describe('Error page', () => {
  it('explains that the transactions could not be loaded', () => {
    render(<ErrorPage />)

    expect(screen.getByRole('alert')).toHaveTextContent("We couldn't load your transactions")
  })

  it('links back to the dashboard with a Try again button', () => {
    render(<ErrorPage />)

    expect(screen.getByRole('link', { name: 'Try again' })).toHaveAttribute('href', '/')
  })
})
