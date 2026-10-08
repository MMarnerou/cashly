import { TransactionType } from './types'
import type { Transaction, TransactionStatus } from './types'

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

export interface TransactionFilters {
  merchant: string
  status: TransactionStatus | 'all'
  type: TransactionType | 'all'
  sort: SortOption
}

export const DEFAULT_FILTERS: TransactionFilters = {
  merchant: '',
  status: 'all',
  type: 'all',
  sort: 'date-desc',
}

export const hasActiveFilters = (filters: TransactionFilters): boolean => {
  return (
    filters.merchant.trim() !== '' ||
    filters.status !== 'all' ||
    filters.type !== 'all' ||
    filters.sort !== DEFAULT_FILTERS.sort
  )
}

export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] => {
  const merchantQuery = filters.merchant.trim().toLowerCase()

  return transactions.filter(
    (transaction) =>
      (merchantQuery === '' || transaction.merchant.toLowerCase().includes(merchantQuery)) &&
      (filters.status === 'all' || transaction.status === filters.status) &&
      (filters.type === 'all' || transaction.type === filters.type),
  )
}

/** Signed amount in the account currency: credits positive, debits negative. */
const signedaccountAmount = (transaction: Transaction): number => {
  return transaction.type === TransactionType.Credit
    ? transaction.accountAmount
    : -transaction.accountAmount
}

const byDateAsc = (a: Transaction, b: Transaction) => Date.parse(a.date) - Date.parse(b.date)
const byAmountAsc = (a: Transaction, b: Transaction) =>
  signedaccountAmount(a) - signedaccountAmount(b)

const comparators: Record<SortOption, (a: Transaction, b: Transaction) => number> = {
  'date-desc': (a, b) => byDateAsc(b, a),
  'date-asc': byDateAsc,
  'amount-desc': (a, b) => byAmountAsc(b, a),
  'amount-asc': byAmountAsc,
}

export const sortTransactions = (transactions: Transaction[], sort: SortOption): Transaction[] => {
  return [...transactions].sort(comparators[sort])
}
