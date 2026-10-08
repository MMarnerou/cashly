import type { Account } from '@/lib/types'
import { formatMoney } from '@/lib/format'

export const AccountSummary = ({ account }: { account: Account }) => {
  return (
    <section aria-labelledby="account-name" className="card account-summary">
      <h1 id="account-name" className="account-summary__name">
        {account.name}
      </h1>
      <p className="account-summary__balance">
        {formatMoney(account.balance, account.currency)}
      </p>
      <p className="account-summary__meta">
        Current balance in{' '}
        <span className="account-summary__currency">{account.currency}</span>
      </p>
    </section>
  )
}
