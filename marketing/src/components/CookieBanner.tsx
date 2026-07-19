"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "lifeguard.cookieConsent.v1";

type State = "unset" | "essential" | "all";

export function CookieBanner() {
  const [state, setState] = useState<State>("unset");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "all" || saved === "essential") setState(saved);
    } catch {
      /* private mode etc. */
    }
  }, []);

  function decide(s: Exclude<State, "unset">) {
    try {
      window.localStorage.setItem(KEY, s);
    } catch { /* ignore */ }
    setState(s);
  }

  if (!mounted || state !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed left-4 bottom-4 z-50 max-w-[280px]"
    >
      <div
        className="rounded-lg px-3 py-2 shadow-stripe-3 flex items-center gap-2.5"
        style={{
          background: "rgba(10,10,10,0.94)",
          color: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-[12px]" style={{ fontWeight: 600, color: "#fff" }}>
            Essential cookies only.
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
            No tracking. No ads.{" "}
            <Link
              href="/trust#privacy"
              style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: 2 }}
            >
              Privacy
            </Link>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => decide("essential")}
            className="text-[11px] px-2.5 py-1.5 rounded-md"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.85)",
            }}
            aria-label="Essential cookies only"
          >
            Essential
          </button>
          <button
            onClick={() => decide("all")}
            className="text-[11px] px-2.5 py-1.5 rounded-md"
            style={{
              background: "var(--color-red)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
