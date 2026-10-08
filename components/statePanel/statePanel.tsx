import type { ReactNode } from 'react'

interface StatePanelProps {
  title: string
  description?: string
  tone?: 'neutral' | 'error'
  icon?: ReactNode
  action?: ReactNode
}

// Used for the empty, no-results and error states.
export const StatePanel = ({ title, description, tone = 'neutral', icon, action }: StatePanelProps) => {
  const toneClass = tone === 'error' ? ' state-panel--error' : ''

  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={`card state-panel${toneClass}`}
    >
      {icon}
      <p className="state-panel__title">{title}</p>
      {description && <p className="state-panel__description">{description}</p>}
      {action && <div className="state-panel__action">{action}</div>}
    </div>
  )
}
