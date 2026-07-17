"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg,#fafaf9)] text-[var(--ink,#1f2937)]">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-[var(--muted,#6b7280)]">500</p>
        <h1 className="mt-2 text-3xl font-medium">Something went wrong</h1>
        <p className="mt-3 text-[var(--muted,#6b7280)] max-w-md">
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-md px-5 h-10 text-sm font-medium bg-[var(--accent,#06b6a4)] text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
