"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * LoginForm — actual email + password login that POSTs to
 * /api/care/auth/login. Replaces the old decorative "Continue
 * with SSO / Email me a magic link" buttons, which had no
 * real auth behind them.
 */
export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search?.get("next") || "/care/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/care/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Login failed (${res.status})`);
        return;
      }
      // Cookie is set by the server response. Redirect to dashboard.
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" autoComplete="on">
      <div>
        <label
          htmlFor="email"
          className="block text-[12px] mb-1.5 uppercase tracking-[0.1em]"
          style={{ color: "var(--color-muted)", fontWeight: 600 }}
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-md text-[14px]"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-line-strong)",
            color: "var(--color-ink)",
            outline: "none",
          }}
          placeholder="admin@life.guard"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[12px] mb-1.5 uppercase tracking-[0.1em]"
          style={{ color: "var(--color-muted)", fontWeight: 600 }}
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-md text-[14px]"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-line-strong)",
            color: "var(--color-ink)",
            outline: "none",
          }}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div
          className="text-[13px] px-3 py-2 rounded-md"
          style={{
            background: "rgba(225,29,46,0.08)",
            border: "1px solid rgba(225,29,46,0.30)",
            color: "var(--color-red)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={busy || !email || !password}
        className="btn btn-red btn-lg w-full disabled:opacity-40"
        style={{ opacity: busy ? 0.5 : 1 }}
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <div className="text-center text-[13px]" style={{ color: "var(--color-muted)" }}>
        Don&rsquo;t have an account?{" "}
        <Link href="/signup" style={{ color: "var(--color-red)", fontWeight: 510 }}>
          Create one
        </Link>
        .
      </div>

      {/* Default credentials hint — only in non-prod, but for this
          demo build always visible so reviewers don't get stuck. */}
      <div
        className="mt-4 px-3 py-2 rounded-md text-[12px] mono"
        style={{
          background: "var(--color-bg-soft)",
          border: "1px solid var(--color-line)",
          color: "var(--color-muted)",
        }}
      >
        Default test account:{" "}
        <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>admin@life.guard</span>{" "}
        / <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>admin</span>
      </div>
    </form>
  );
}