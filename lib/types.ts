export enum TransactionType {
  Credit = 'credit',
  Debit = 'debit',
}
export type TransactionStatus = 'completed' | 'pending' | 'declined'

export interface Account {
  id: string
  name: string
  currency: string
  balance: number
}

export interface Transaction {
  id: string
  merchant: string
  description: string
  date: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: string
  accountAmount: number  /**Converted to the account currency. */
}

export interface AccountResponse {
  account: Account
  transactions: Transaction[]
}
