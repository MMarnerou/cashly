import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CopyButton } from './copyButton'

describe('CopyButton', () => {
  let writeText: ReturnType<typeof vi.fn>

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('labels the button with what it copies', () => {
    render(<CopyButton value="acc_000001" label="account ID" />)

    expect(screen.getByRole('button', { name: 'Copy account ID' })).toBeInTheDocument()
  })

  it('copies the value and shows Copied', async () => {
    render(<CopyButton value="acc_000001" label="account ID" />)

    fireEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('Copied')).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledWith('acc_000001')
  })

  it('shows Copy failed when the clipboard is unavailable', async () => {
    writeText.mockRejectedValue(new Error('Permission denied'))
    render(<CopyButton value="acc_000001" label="account ID" />)

    fireEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('Copy failed')).toBeInTheDocument()
  })

  it('goes back to Copy after two seconds', async () => {
    vi.useFakeTimers()
    render(<CopyButton value="acc_000001" label="account ID" />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })
    expect(screen.getByText('Copied')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })
})
