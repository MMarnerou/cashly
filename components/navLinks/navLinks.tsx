'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Transactions' },
  { href: '/profile', label: 'Profile' },
]

// Client component so it can highlight the link for the current page.
export const NavLinks = () => {
  const pathname = usePathname()

  return (
    <>
      {LINKS.map((link) => {
        const isActive = pathname === link.href
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className="nav-link"
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </>
  )
}
