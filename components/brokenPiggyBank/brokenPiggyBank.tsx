import BrokenPiggyBankIcon from '@/assets/icons/broken-piggy-bank.svg'

// Drawn with currentColor, so the colour comes from the surrounding CSS.
export const BrokenPiggyBank = ({ className = 'state-panel__icon' }: { className?: string }) => {
  return <BrokenPiggyBankIcon className={className} aria-hidden="true" />
}
