'use client'

import { useMemo, useState } from 'react'
import { useAccount } from '@/hooks/useAccount'
import type { Transaction } from '@/lib/types'
import {
  DEFAULT_FILTERS,
  filterTransactions,
  hasActiveFilters,
  sortTransactions,
  type TransactionFilters as Filters,
} from '@/lib/transactions'
import { AccountSummary } from '../accountSummary'
import { BrokenPiggyBank } from '../brokenPiggyBank'
import { DashboardSkeleton } from '../dashboardSkeleton'
import { StatePanel } from '../statePanel'
import { TransactionDetailsSidebar } from '../transactionDetailsSidebar'
import { TransactionFilters } from '../transactionFilters'
import { TransactionList } from '../transactionList'

export const TransactionDashboard = () => {
  const { state, retry } = useAccount()
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selected, setSelected] = useState<Transaction | null>(null)

  const visibleTransactions = useMemo(() => {
    if (state.status !== 'success') return []
    return sortTransactions(filterTransactions(state.transactions, filters), filters.sort)
  }, [state, filters])

  if (state.status === 'loading') {
    return <DashboardSkeleton />
  }

  if (state.status === 'error') {
    return (
      <StatePanel
        tone="error"
        icon={<BrokenPiggyBank />}
        title="We couldn't load your transactions"
        description={state.message}
        action={
          <button type="button" onClick={retry} className="button button--primary">
            Try again
          </button>
        }
      />
    )
  }

  return (
    <>
      <div className="dashboard-top">
        <AccountSummary account={state.account} />

        {state.transactions.length > 0 && (
          <TransactionFilters
            filters={filters}
            isFiltered={hasActiveFilters(filters)}
            onChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        )}
      </div>

      <TransactionList
        transactions={visibleTransactions}
        totalCount={state.transactions.length}
        accountCurrency={state.account.currency}
        onSelect={setSelected}
        onClearFilters={() => setFilters(DEFAULT_FILTERS)}
      />

      <TransactionDetailsSidebar
        transaction={selected}
        accountCurrency={state.account.currency}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
