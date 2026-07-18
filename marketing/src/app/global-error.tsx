"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Top-level error boundary. Catches any uncaught render error in a page
 * subtree and shows a real, branded error state with a path forward.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this would forward to Sentry / Honeybadger. Locally
    // we just log to the console so the dev sees the stack.
    // eslint-disable-next-line no-console
    console.error("[LifeGuard] page error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-[560px] w-full text-center">
            <div className="text-[11px] uppercase tracking-[0.24em] mb-3" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
              Error
            </div>
            <h1
              className="display-xl text-[44px] md:text-[64px]"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="shimmer-text">Something broke.</span>
            </h1>
            <p className="lead mt-6">
              The page threw an unhandled error. We&rsquo;ve logged the digest
              below &mdash; if you&rsquo;d be so kind, forward it to{" "}
              <a
                href="mailto:engineering@life.guard"
                style={{ color: "var(--color-red)", fontWeight: 600 }}
              >
                engineering@life.guard
              </a>{" "}
              so we can fix it.
            </p>
            {error.digest && (
              <code
                className="mono inline-block mt-6 text-[11px] px-3 py-1.5 rounded-md"
                style={{
                  background: "var(--color-bg-soft)",
                  border: "1px solid var(--color-line)",
                  color: "var(--color-muted)",
                }}
              >
                {error.digest}
              </code>
            )}
            <div className="mt-8 flex justify-center flex-wrap gap-3">
              <button onClick={reset} className="btn btn-red btn-lg">
                Try again
              </button>
              <Link href="/" className="btn btn-ghost btn-lg">
                Back to home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
