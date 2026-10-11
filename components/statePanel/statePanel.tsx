import type { ReactNode } from 'react'
import './statePanel.css'

interface StatePanelProps {
  title: string
  description?: string
  isError?: boolean
  icon?: ReactNode
  action?: ReactNode
}

// Used for the empty, no-results and error states.
export const StatePanel = ({ title, description, isError = false, icon, action }: StatePanelProps) => {
  const errorClass = isError ? ' state-panel--error' : ''

  return (
    <div
      role={isError ? 'alert' : undefined}
      className={`card state-panel${errorClass}`}
    >
      {icon}
      <p className="state-panel__title">{title}</p>
      {description && <p className="state-panel__description">{description}</p>}
      {action && <div className="state-panel__action">{action}</div>}
    </div>
  )
}
