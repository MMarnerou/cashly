import type { TransactionStatus } from '@/lib/types'

const LABELS: Record<TransactionStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  declined: 'Declined',
}

// Status is shown as text as well as colour, so it doesn't rely on colour alone.
export const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  return <span className={`status-badge status-badge--${status}`}>{LABELS[status]}</span>
}
