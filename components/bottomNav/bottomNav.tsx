'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import DashboardIcon from '@/assets/icons/dashboard.svg'
import UserIcon from '@/assets/icons/user.svg'
import SignOutIcon from '@/assets/icons/sign-out.svg'
import './bottomNav.css'

// Icon-only navigation for phones. Each control has an aria-label, since the icon alone isn't a name.
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
                <Icon className="bottom-nav__icon" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
        <li>
          <form action={logout}>
            <button type="submit" aria-label="Sign out" title="Sign out" className="bottom-nav__item">
              <SignOutIcon className="bottom-nav__icon" aria-hidden="true" />
            </button>
          </form>
        </li>
      </ul>
    </nav>
  )
}
