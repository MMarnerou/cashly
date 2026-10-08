import { TransactionType, type Transaction } from '@/lib/types'
import { formatDate, formatMoney } from '@/lib/format'
import { StatusBadge } from '../statusBadge'
import { StatePanel } from '../statePanel'

interface TransactionListProps {
  /** Transactions after filters and sorting are applied. */
  transactions: Transaction[]
  /** Total number of transactions on the account, before filters. */
  totalCount: number
  accountCurrency: string
  onSelect: (transaction: Transaction) => void
  onClearFilters: () => void
}

export const TransactionList = ({
  transactions,
  totalCount,
  accountCurrency,
  onSelect,
  onClearFilters,
}: TransactionListProps) => {
  if (totalCount === 0) {
    return (
      <StatePanel
        title="No transactions yet"
        description="Transactions will appear here once they are posted to this account."
      />
    )
  }

  if (transactions.length === 0) {
    return (
      <StatePanel
        title="No transactions match your filters"
        description="Try a different merchant name or clear the filters."
        action={
          <button type="button" onClick={onClearFilters} className="button button--primary">
            Clear filters
          </button>
        }
      />
    )
  }

  return (
    <section aria-labelledby="transactions-heading" className="card transactions">
      <div className="transactions__header">
        <h2 id="transactions-heading" className="card__title">
          Transactions
        </h2>
        <p className="transactions__count">
          Showing {transactions.length} of {totalCount}
        </p>
      </div>

      <div aria-hidden="true" className="transactions__columns">
        <span>Merchant</span>
        <span>Date</span>
        <span>Status</span>
        <span className="text-right">Amount</span>
      </div>

      <ul className="transactions__list">
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <TransactionRow
              transaction={transaction}
              accountCurrency={accountCurrency}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

const TransactionRow = ({
  transaction,
  accountCurrency,
  onSelect,
}: {
  transaction: Transaction
  accountCurrency: string
  onSelect: (transaction: Transaction) => void
}) => {
  const { merchant, description, date, status, type, amount, currency, accountAmount } =
    transaction

  const isDeclined = status === 'declined'
  const signedMinor = type === TransactionType.Credit ? amount : -amount
  const signedAccountMinor = type === TransactionType.Credit ? accountAmount : -accountAmount
  const showAccountEquivalent = currency !== accountCurrency

  const amountClass = [
    'transaction-row__amount-value',
    isDeclined ? 'transaction-row__amount-value--declined' : '',
    !isDeclined && type === TransactionType.Credit ? 'transaction-row__amount-value--credit' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      onClick={() => onSelect(transaction)}
      aria-label={`${merchant}, ${formatMoney(signedMinor, currency, { signed: true })}, ${status}`}
      className="transaction-row"
    >
      <span className="transaction-row__main">
        <span className="transaction-row__merchant">{merchant}</span>
        <span className="transaction-row__description">{description}</span>
        <span className="transaction-row__meta">
          {formatDate(date)}
          <StatusBadge status={status} />
        </span>
      </span>

      <span className="transaction-row__date">{formatDate(date)}</span>

      <span className="transaction-row__status">
        <StatusBadge status={status} />
      </span>

      <span className="transaction-row__amount">
        <span className={amountClass}>{formatMoney(signedMinor, currency, { signed: true })}</span>
        {showAccountEquivalent && (
          <span className="transaction-row__equivalent">
            ≈ {formatMoney(signedAccountMinor, accountCurrency, { signed: true })}
          </span>
        )}
      </span>
    </button>
  )
}
