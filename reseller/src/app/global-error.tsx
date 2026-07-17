"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center text-ink bg-bg">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted">500</p>
          <h1 className="mt-2 text-3xl font-medium">Something went wrong</h1>
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center justify-center rounded-md px-5 h-10 text-sm font-medium bg-accent text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
