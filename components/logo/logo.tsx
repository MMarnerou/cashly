import LogoIcon from '@/public/icon.svg'
import './logo.css'

// Same artwork as the tab icon served from public/icon.svg.
export const Logo = ({ className = 'logo' }: { className?: string }) => {
  return <LogoIcon className={className} aria-hidden="true" />
}
