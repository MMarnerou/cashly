import type { TransactionStatus } from '@/lib/types'
import './statusBadge.css'
import { statusesLabels } from '@/lib/statics';

// Status is shown as text as well as colour, so it doesn't rely on colour alone.
export const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  return <span className={`status-badge status-badge--${status}`}>{statusesLabels[status]}</span>
}
