// A piggy bank with a crack down the middle, for error states.
// Drawn with currentColor, so the colour comes from the surrounding CSS.
export const BrokenPiggyBank = ({ className = 'state-panel__icon' }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="30" cy="36" rx="22" ry="16" />
      <path d="m20 22 4-10 7 9" />
      <rect x="50" y="31" width="6" height="9" rx="2" />
      <path d="M8 34q-5-3-2-8M19 49v6h7v-6M36 49v6h7v-6M22 25h14" />
      <circle cx="41" cy="30" r="1.5" fill="currentColor" />
      <path d="m31 21 4 7-6 5 7 7-5 9" strokeWidth="3" />
    </svg>
  )
}
