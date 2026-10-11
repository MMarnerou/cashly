import { describe, expect, it } from 'vitest'
import { getInitials } from '@/lib/helpers'

describe('getInitials', () => {
  it('takes the first letter of the first two names', () => {
    expect(getInitials('Maria Marnerou')).toBe('MM')
  })

  it('uses only the first two names when there are more', () => {
    expect(getInitials('Ana Maria Lopez')).toBe('AM')
  })

  it('uses a single letter for a one-word name', () => {
    expect(getInitials('Maria')).toBe('M')
  })

  it('uppercases the initials', () => {
    expect(getInitials('maria marnerou')).toBe('MM')
  })

  it('returns an empty string for an empty name', () => {
    expect(getInitials('')).toBe('')
  })
})
