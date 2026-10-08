export const DashboardSkeleton = () => {
  return (
    <div role="status" aria-live="polite" className="stack">
      <span className="sr-only">Loading your transactions</span>

      <div className="card account-summary" aria-hidden="true">
        <div className="skeleton skeleton--light skeleton--title" />
        <div className="skeleton skeleton--balance" />
        <div className="skeleton skeleton--light skeleton--caption" />
      </div>

      <div className="card" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="skeleton-row">
            <div className="skeleton-row__lines">
              <div className="skeleton skeleton--line-lg" />
              <div className="skeleton skeleton--light skeleton--line-sm" />
            </div>
            <div className="skeleton skeleton--amount" />
          </div>
        ))}
      </div>
    </div>
  )
}
