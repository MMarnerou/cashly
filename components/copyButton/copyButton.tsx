'use client'

import { useEffect, useRef, useState } from 'react'

const RESET_DELAY_MS = 2000

// Copies `value` to the clipboard and briefly shows the result on the button.
export const CopyButton = ({ value, label }: { value: string; label: string }) => {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus('idle'), RESET_DELAY_MS)
  }

  const text = status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'

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
