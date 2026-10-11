import { TransactionStatus } from "./types";

export const statusesLabels: Record<TransactionStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  declined: 'Declined',
}