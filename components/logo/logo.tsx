// Same geometry as assets/icon.svg, so the tab icon and the in-page logo match.
export const LogoMark = ({ className = 'logo-mark' }: { className?: string }) => {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#18181b" />
      <path d="M21.657 10.343a8 8 0 1 0 0 11.314" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
      <circle cx="25.5" cy="16" r="2" fill="#34d399" />
    </svg>
  )
}
