'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { logout } from '@/app/actions/auth'

// Icon-only navigation for phones. Each control has an aria-label, since the icon alone isn't a name.
const NavIcon = ({ children }: { children: ReactNode }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className="bottom-nav__icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const DashboardIcon = () => {
  return (
    <NavIcon>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </NavIcon>
  )
}

const UserIcon = () => {
  return (
    <NavIcon>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </NavIcon>
  )
}

const SignOutIcon = () => {
  return (
    <NavIcon>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h10" />
    </NavIcon>
  )
}

const LINKS = [
  { href: '/', label: 'Transactions', Icon: DashboardIcon },
  { href: '/profile', label: 'Profile', Icon: UserIcon },
]

export const BottomNav = () => {
  const pathname = usePathname()

  return (
    <nav aria-label="Main" className="bottom-nav">
      <ul className="bottom-nav__list">
        {LINKS.map(({ href, label, Icon }) => {
          const isActive = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                title={label}
                aria-current={isActive ? 'page' : undefined}
                className="bottom-nav__item"
              >
                <Icon />
              </Link>
            </li>
          )
        })}
        <li>
          <form action={logout}>
            <button type="submit" aria-label="Sign out" title="Sign out" className="bottom-nav__item">
              <SignOutIcon />
            </button>
          </form>
        </li>
      </ul>
    </nav>
  )
}
