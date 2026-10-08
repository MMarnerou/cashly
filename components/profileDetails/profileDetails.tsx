import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { mockAccount } from '@/mocks/mockData'
import { demoUser } from '@/mocks/mockUsers'
import { SESSION_COOKIE, verifySession } from '@/lib/session'
import { CopyButton } from '../copyButton'

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// Reads the session cookie, so it must render inside a <Suspense> boundary.
export const ProfileDetails = async () => {
  const cookieStore = await cookies()
  const email = await verifySession(cookieStore.get(SESSION_COOKIE)?.value)

  if (email !== demoUser.email) {
    redirect('/login')
  }

  return (
    <div className="stack">
      <section className="card profile-header">
        <div aria-hidden="true" className="avatar">
          {getInitials(demoUser.name)}
        </div>
        <div className="profile-header__text">
          <h1 className="profile-header__name">{demoUser.name}</h1>
          <p className="profile-header__email">{demoUser.email}</p>
        </div>
      </section>

      <section aria-labelledby="personal-details" className="card card--padded">
        <h2 id="personal-details" className="card__title">
          Personal details
        </h2>
        <dl className="details-list details-list--spaced">
          <dt>Full name</dt>
          <dd>{demoUser.name}</dd>

          <dt>Email</dt>
          <dd className="details-list__break">{demoUser.email}</dd>
        </dl>
      </section>

      <section aria-labelledby="account-details" className="card card--padded">
        <h2 id="account-details" className="card__title">
          Account
        </h2>
        <dl className="details-list details-list--spaced">
          <dt>Account name</dt>
          <dd>{mockAccount.name}</dd>

          <dt>Account ID</dt>
          <dd className="details-list__value">
            <span className="details-list__mono">{mockAccount.id}</span>
            <CopyButton value={mockAccount.id} label="account ID" />
          </dd>

          <dt>Currency</dt>
          <dd>{mockAccount.currency}</dd>
        </dl>
      </section>
    </div>
  )
}

export const ProfileSkeleton = () => {
  return (
    <div role="status" aria-live="polite" className="stack">
      <span className="sr-only">Loading your profile</span>
      <div className="card skeleton-block--sm skeleton--light" />
      <div className="card skeleton-block--md skeleton--light" />
    </div>
  )
}
