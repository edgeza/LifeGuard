export default function Loading() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-label="Loading page">
      {/* Skeleton header */}
      <div className="container-x pt-20 pb-12">
        <div className="max-w-[820px] space-y-5">
          <div
            className="shimmer-skeleton h-3 w-24 rounded-full"
            style={{ background: "var(--color-bg-soft)" }}
          />
          <div
            className="shimmer-skeleton h-12 md:h-16 w-3/4 rounded-md"
            style={{ background: "var(--color-bg-soft)" }}
          />
          <div
            className="shimmer-skeleton h-4 w-2/3 rounded"
            style={{ background: "var(--color-bg-soft)" }}
          />
          <div
            className="shimmer-skeleton h-4 w-1/2 rounded"
            style={{ background: "var(--color-bg-soft)" }}
          />
        </div>
      </div>
      {/* Skeleton cards */}
      <div className="container-x pb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 h-40 shimmer-skeleton"
              style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
