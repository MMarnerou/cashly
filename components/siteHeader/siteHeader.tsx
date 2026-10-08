import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { LogoMark } from '../logo'
import { NavLinks } from '../navLinks'

export const SiteHeader = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <LogoMark />
          <span className="brand__name">Cashly</span>
        </Link>

        <nav aria-label="Main" className="site-header__nav">
          <ul className="nav-list">
            <NavLinks />
            <li>
              <form action={logout}>
                <button type="submit" className="nav-button">
                  Sign out
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
