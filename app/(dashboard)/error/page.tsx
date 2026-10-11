import Link from 'next/link'
import { BrokenPiggyBank } from '@/components/brokenPiggyBank'
import { StatePanel } from '@/components/statePanel'

// Shown when the account can't be loaded. The dashboard sends visitors here on failure.
const ErrorPage = () => {
  return (
    <main className="app-main">
      <div className="app-container">
        <StatePanel
          isError
          icon={<BrokenPiggyBank />}
          title="We couldn't load your transactions"
          description="Something went wrong while loading your account. Please try again."
          action={
            <Link href="/" className="button button--primary">
              Try again
            </Link>
          }
        />
      </div>
    </main>
  )
}
export default ErrorPage
