'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { DashboardSkeleton } from '../dashboardSkeleton'
import { TransactionDetailsSidebar } from '../transactionDetailsSidebar'
import { TransactionFilters } from '../transactionFilters'
import { TransactionList } from '../transactionList'
import './transactionDashboard.css'

export const TransactionDashboard = () => {
  const router = useRouter()
  const { state } = useAccount()
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selected, setSelected] = useState<Transaction | null>(null)

  const visibleTransactions = useMemo(() => {
    if (state.status !== 'success') return []
    return sortTransactions(filterTransactions(state.transactions, filters), filters.sort)
  }, [state, filters])

  const hasFailed = state.status === 'error'
  useEffect(() => {
    if (hasFailed) {
      router.replace('/error')
    }
  }, [hasFailed, router])

  if (state.status === 'loading') {
    return <DashboardSkeleton />
  }

  // The error page takes over from here, so nothing is rendered while the redirect happens.
  if (state.status === 'error') {
    return null
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
