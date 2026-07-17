export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg,#fafaf9)] text-[var(--ink,#1f2937)]">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-[var(--muted,#6b7280)]">404</p>
        <h1 className="mt-2 text-3xl font-medium">Page not found</h1>
        <p className="mt-3 text-[var(--muted,#6b7280)] max-w-md">
          The page you were looking for doesn't exist, or has been moved.
        </p>
      </div>
    </div>
  );
}
