export function Skeleton() {
  return (
    <div role="status" aria-label="Loading browse" className="space-y-8 pb-12">
      <div className="skeleton h-[70vh] min-h-96" />
      {[0, 1, 2].map((row) => (
        <div key={row} className="space-y-4 px-6 sm:px-12">
          <div className="skeleton h-6 w-40 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {[0, 1, 2, 3, 4].map((card) => (
              <div key={card} className="skeleton h-64 w-44 shrink-0 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
