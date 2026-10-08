import { TransactionType } from '@/lib/types'
import type { TransactionFilters as Filters } from '@/lib/transactions'

interface TransactionFiltersProps {
  filters: Filters
  isFiltered: boolean
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
}

export const TransactionFilters = ({ filters, isFiltered, onChange, onReset }: TransactionFiltersProps) => {
  return (
    <div role="search" aria-label="Filter transactions" className="card filters">
      <div className="filters__grid">
        <label className="field">
          Merchant
          <input
            type="search"
            value={filters.merchant}
            onChange={(event) => onChange({ merchant: event.target.value })}
            placeholder="Search merchants"
            className="input"
          />
        </label>

        <label className="field">
          Status
          <select
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value as Filters['status'] })}
            className="select"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </label>

        <label className="field">
          Type
          <select
            value={filters.type}
            onChange={(event) => onChange({ type: event.target.value as Filters['type'] })}
            className="select"
          >
            <option value="all">All types</option>
            <option value={TransactionType.Credit}>Credits</option>
            <option value={TransactionType.Debit}>Debits</option>
          </select>
        </label>

        <label className="field">
          Sort by
          <select
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as Filters['sort'] })}
            className="select"
          >
            <option value="date-desc">Date: newest first</option>
            <option value="date-asc">Date: oldest first</option>
            <option value="amount-desc">Amount: highest first</option>
            <option value="amount-asc">Amount: lowest first</option>
          </select>
        </label>
      </div>

      <div className="filters__actions">
        <button type="button" onClick={onReset} disabled={!isFiltered} className="text-button">
          Clear filters
        </button>
      </div>
    </div>
  )
}
