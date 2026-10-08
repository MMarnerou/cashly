import { describe, expect, it } from 'vitest'
import { metadata } from '@/app/layout'

describe('Root layout metadata', () => {
  it('sets the app title and description', () => {
    expect(metadata.title).toBe('Cashly')
    expect(metadata.description).toBe('Account summary and recent transactions')
  })

  it('points the tab icon at the icon route', () => {
    expect(metadata.icons).toEqual([{ url: '/icon', type: 'image/svg+xml' }])
  })
})
