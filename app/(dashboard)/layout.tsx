import type { ReactNode } from 'react'
import { BottomNav } from '@/components/bottomNav'
import { SiteHeader } from '@/components/siteHeader'

// Pages that need a signed-in user. The login page sits outside this group, so it has no header.
// On phones, the bottom bar replaces the text navigation in the header.
const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SiteHeader />
      {children}
      <BottomNav />
    </>
  )
}
export default AppLayout
