'use client'

import { useEffect, useRef, useState } from 'react'
import './copyButton.css'

const RESET_DELAY_MS = 2000

enum CopyStatus {
  Idle = 'idle',
  Copied = 'copied',
  Failed = 'failed',
}

// Copies `value` to the clipboard and briefly shows the result on the button.
export const CopyButton = ({ value, label }: { value: string; label: string }) => {
  const [status, setStatus] = useState<CopyStatus>(CopyStatus.Idle)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus(CopyStatus.Copied)
    } catch {
      setStatus(CopyStatus.Failed)
    }

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus(CopyStatus.Idle), RESET_DELAY_MS)
  }

  const text =
    status === CopyStatus.Copied ? 'Copied' : status === CopyStatus.Failed ? 'Copy failed' : 'Copy'

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className="copy-button"
    >
      {text}
    </button>
  )
}
