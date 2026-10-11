import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import RootLayout, { metadata } from '@/app/layout'

describe('Root layout metadata', () => {
  it('sets the app title and description', () => {
    expect(metadata.title).toBe('Cashly')
    expect(metadata.description).toBe('Account summary and recent transactions')
  })

  it('points the tab icon at the static icon file', () => {
    expect(metadata.icons).toEqual([{ url: '/icon.svg', type: 'image/svg+xml' }])
  })
})

describe('Root layout', () => {
  it('renders the page inside an English html document', () => {
    const tree = RootLayout({ children: 'page content' } as never) as ReactElement<{
      lang: string
      children: ReactElement<{ children: string }>
    }>

    expect(tree.type).toBe('html')
    expect(tree.props.lang).toBe('en')
    expect(tree.props.children.props.children).toBe('page content')
  })
})
