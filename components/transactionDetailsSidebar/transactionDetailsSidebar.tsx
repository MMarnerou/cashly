'use client'

import { useEffect, useRef } from 'react'
import { TransactionType } from '@/lib/types'
import type { Transaction, TransactionStatus } from '@/lib/types'
import { formatDateTime, formatMoney } from '@/lib/format'
import { CopyButton } from '../copyButton'
import { StatusBadge } from '../statusBadge'

interface TransactionDetailsSidebarProps {
  transaction: Transaction | null
  accountCurrency: string
  onClose: () => void
}

const STATUS_NOTES: Partial<Record<TransactionStatus, string>> = {
  pending: 'This transaction is pending and the amount may change before it posts.',
  declined: 'Declined transactions do not affect your balance.',
}

// Native <dialog> gives focus trapping, Escape to close and the backdrop without extra code.
// It is styled as a panel docked to the right edge instead of a centred box.
export const TransactionDetailsSidebar = ({
  transaction,
  accountCurrency,
  onClose,
}: TransactionDetailsSidebarProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (transaction && !dialog.open) {
      dialog.showModal()
    } else if (!transaction && dialog.open) {
      dialog.close()
    }
  }, [transaction])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Clicks on the backdrop land on the dialog itself, not on its content.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="transaction-details-title"
      className="details-sidebar"
    >
      {transaction && (
        <TransactionDetails
          transaction={transaction}
          accountCurrency={accountCurrency}
          onClose={onClose}
        />
      )}
    </dialog>
  )
}

const TransactionDetails = ({
  transaction,
  accountCurrency,
  onClose,
}: {
  transaction: Transaction
  accountCurrency: string
  onClose: () => void
}) => {
  const { merchant, description, date, type, status, amount, currency, accountAmount, id } =
    transaction

  const signedMinor = type === TransactionType.Credit ? amount : -amount
  const signedAccountMinor = type === TransactionType.Credit ? accountAmount : -accountAmount
  const note = STATUS_NOTES[status]

  return (
    <div className="details-sidebar__panel">
      <div className="details-sidebar__header">
        <div className="details-sidebar__text">
          <h2 id="transaction-details-title" className="details-sidebar__title">
            {merchant}
          </h2>
          <p className="details-sidebar__date">{formatDateTime(date)}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close transaction details" className="icon-button">
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="details-sidebar__body">
        <div className="details-sidebar__summary">
          <p className="details-sidebar__amount">
            {formatMoney(signedMinor, currency, { signed: true })}
          </p>
          <StatusBadge status={status} />
        </div>

        {note && <p className="details-sidebar__note">{note}</p>}

        <dl className="details-list">
          <dt>Type</dt>
          <dd className="details-list__capitalize">{type}</dd>

          <dt>Currency</dt>
          <dd>{currency}</dd>

          {currency !== accountCurrency && (
            <>
              <dt>In {accountCurrency}</dt>
              <dd className="tabular">
                {formatMoney(signedAccountMinor, accountCurrency, { signed: true })}
              </dd>
            </>
          )}

          <dt>Transaction reference</dt>
          <dd className="details-list__value">
            <span className="details-list__mono">{id}</span>
            <CopyButton value={id} label="transaction reference" />
          </dd>

          <dt>Description</dt>
          <dd className="details-list__description">{description}</dd>
        </dl>
      </div>
    </div>
  )
}
