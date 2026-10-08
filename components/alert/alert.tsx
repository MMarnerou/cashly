import type { ReactNode } from 'react'

interface AlertProps {
  tone?: 'error' | 'success' | 'info'
  children: ReactNode
}

// Inline message for form errors, confirmations and notes.
// Errors use role="alert" so screen readers announce them straight away.
export const Alert = ({ tone = 'info', children }: AlertProps) => {
  return (
    <p role={tone === 'error' ? 'alert' : undefined} className={`alert alert--${tone}`}>
      {children}
    </p>
  )
}
